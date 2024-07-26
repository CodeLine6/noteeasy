const Notes = require("../../models/Notes");
const Y = require('yjs');

const restoreNoteVersion = async (req, res) => {
    try {
        const note = await Notes.findById(req.params.id);
        const noteState = note.document;
        if(!noteState) {
            return res.status(404).json({message:"Not Found"});
        }
        const currentDoc =  new Y.Doc({ gc: false });
        Y.applyUpdate(currentDoc, noteState);

        const versionToRestore = currentDoc.getArray('versions').get(req.params.version);

        if(!versionToRestore) {
            return res.status(404).json({message:"Version Does Not Exist"});
        }
        const docToRestore = Y.createDocFromSnapshot(currentDoc, Y.decodeSnapshot(versionToRestore.snapshot));
        currentDoc.getXmlFragment('default')
        docToRestore.getXmlFragment('default')
        if(docToRestore.toJSON().default == currentDoc.toJSON().default) return res.status(200).send({message:"Note restored"});
        
        const currentSnapshot = Y.snapshot(docToRestore);
        const restoreVersions = docToRestore.getArray('versions');
        restoreVersions.push([{
            date: new Date().getTime(),
            snapshot: Y.encodeSnapshot(currentSnapshot),
            clientID: docToRestore.clientID
        }])

        const restoreState = Y.encodeStateAsUpdate(docToRestore);
        note.document = Buffer.from(restoreState);

        await note.save();

        return res.status(200).send({message:"Note restored"});
    }
    catch (error) {
        console.log(error.message)
        return res.status(500).json({message:"Internal server error"});
    }
}

module.exports = restoreNoteVersion
const { validationResult } = require("express-validator");
const Notes = require("../../models/Notes");
const { TiptapTransformer } = require("@hocuspocus/transformer");
const Y = require('yjs');
const tipTapExtensions = require('../../tiptapExtensions');

const addnote = async (req, res) => {
    // If there are errors, return Bad Request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ "errors": errors.array() });
    }

    const { title, description, tag } = req.body;

    try {
        const newNote = new Notes({
            title, description, tag, user: req.user.id
        });

        const ydoc = TiptapTransformer.toYdoc(
            // the actual JSON
            description,
            // the `field` you’re using in Tiptap. If you don’t know what that is, use 'default'.
            "default",
            // The Tiptap extensions you’re using. Those are important to create a valid schema.
            tipTapExtensions
        )

        const currSnapshot = Y.snapshot(ydoc);
        const currVersions = ydoc.getArray('versions')
        ydoc.gc = false;
        currVersions.push([{
            date: new Date().getTime(),
            snapshot: Y.encodeSnapshot(currSnapshot),
            clientID: ydoc.clientID,
        }]);
        const state = Y.encodeStateAsUpdate(ydoc)
        newNote.document = Buffer.from(state)
        let savedNote = await newNote.save();
        savedNote = await Notes.findById(savedNote._id).populate('user').populate('collaborators')    
        return res.status(200).json(savedNote)

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message:"Internal server error"});
    }
}

module.exports = addnote
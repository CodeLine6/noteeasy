const { Server } = require("@hocuspocus/server");
const { TiptapTransformer } = require("@hocuspocus/transformer");
const Y = require('yjs');
const tipTapExtensions = require('./tiptapExtensions');
const { Database } = require("@hocuspocus/extension-database");
const Notes = require("./models/Notes");
let timer;

const server = Server.configure({
    port : process.env.SERVER_PORT_NUMBER,
    debounce: 2000,
    extensions: [
        new Database({
            fetch: async ({ documentName,document }) => {
                document.gc = false   //   Disabling Garbage Collection on Server
                const noteId = documentName
                const note = await Notes.findById(noteId)
                if (note.document) return note.document


                const ydoc = TiptapTransformer.toYdoc(
                    // the actual JSON
                    note.description,
                    // the `field` you’re using in Tiptap. If you don’t know what that is, use 'default'.
                    "default",
                    // The Tiptap extensions you’re using. Those are important to create a valid schema.
                    tipTapExtensions
                )

                const state = Y.encodeStateAsUpdate(ydoc)
                note.document = Buffer.from(state)
                await note.save()
                return state
            },
            store: async ({ documentName,document }) => {
            
                addVersion(document);
                const state = Y.encodeStateAsUpdate(document)
                const noteId = documentName;
                const note = await Notes.findById(noteId)
                note.document = Buffer.from(state);
                await note.save();
            }
        })
    ]
});

const debouncedAddVersion = (fnc,delay) => {
    clearTimeout(timer)
    console.log("timer cleared")
    timer = setTimeout(() => fnc(),delay)
}
const addVersion = (doc) => {
    const versions = doc.getArray('versions')
    const prevVersion = versions.length === 0 ? null : versions.get(versions.length - 1)
    const prevSnapshot = prevVersion === null ? Y.emptySnapshot : Y.decodeSnapshot(prevVersion.snapshot)
    const prevDoc = prevVersion === null ? new Y.Doc({gc:false}) : Y.createDocFromSnapshot(doc,prevSnapshot)

    const prevXMLFragment = prevDoc.getXmlFragment('default').toJSON()
    const currXMLFragment = doc.getXmlFragment('default').toJSON()
    const snapshot = Y.snapshot(doc)
    if (prevVersion != null) {
        // account for the action of adding a version to doc
        prevSnapshot.sv.set(prevVersion.clientID, /** @type {number} */(prevSnapshot.sv.get(prevVersion.clientID)) + 1)
    }
    if (currXMLFragment !== prevXMLFragment) {
        versions.push([{
            date: new Date().getTime(),
            snapshot: Y.encodeSnapshot(snapshot),
            clientID: doc.clientID,
        }])
    }
    return versions
}


module.exports = server
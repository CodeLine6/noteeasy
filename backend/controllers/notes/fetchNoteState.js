const Notes = require("../../models/Notes");

const fetchNoteState = async (req, res) => {

    try {
        const note = await Notes.findById(req.params.id);
        const noteState = note.document;
        if(!noteState) {
            return res.status(404).json({message:"Not Found"});
        }
        return res.status(200).send(noteState);

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message:"Internal server error"});
    }
}

module.exports = fetchNoteState
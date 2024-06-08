const { validationResult } = require("express-validator");
const Notes = require("../../models/Notes");

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

        let savedNote = await newNote.save();
        savedNote = await Notes.findById(savedNote._id).populate('user').populate('collaborators')    
        return res.status(200).json(savedNote)

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message:"Internal server error"});
    }
}

module.exports = addnote
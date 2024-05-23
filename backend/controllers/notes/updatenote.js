const Notes = require("../../models/Notes");

const updatenote = async (req, res) => {
    const {title,description,tag} = req.body;
    //create new note
    const newNote = {title,description,tag}

    try {
    
    // find the note to be updated & update it
    let note = await Notes.findById(req.params.id);
    if(!note) {
        return res.status(404).json({message: "Not Found"});
    }
    // Allow updation only if user owns this note or is a collaborator of the note
    if(note.user.toString() !== req.user.id  && !(note.collaborators.includes(req.user.id))) {
        return res.status(401).json({message:"Not Allowed"});
    }

    note = await Notes.findByIdAndUpdate(req.params.id,{$set: newNote}, {new: true})

    return res.status(200).json(note)

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message:"Internal server error"});
    }
}

module.exports = updatenote
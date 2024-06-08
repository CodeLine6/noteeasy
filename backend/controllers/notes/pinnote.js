const Notes = require("../../models/Notes");

const pinnote =async (req, res) => {
    const {isPinned} = req.body;
    
    try {
    
    // find the note to be updated & update it
    let note = await Notes.findById(req.params.id);
    if(!note) {
        return res.status(404).json({message:"Not Found"});
    }
    // Allow updation only if user owns this note
    if(note.user.toString() !== req.user.id) {
        return res.status(401).json({message:"Not Allowed"});
    }
    note.pinned = isPinned;
    
    await note.save()

    return res.status(200).json(note)

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message:"Internal server error"});
    }
}

module.exports = pinnote
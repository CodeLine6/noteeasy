const Notes = require("../../models/Notes");

const deletenote = async (req, res) => {
    
    try {
        
    // find the note to be deleted & delete it
    let note = await Notes.findById(req.params.id);
    if(!note) {
        return res.status(404).json({message:"Not Found"});
    }
    // Allow deletion only if user owns this note
    if(note.user.toString() !== req.user.id) {
        return res.status(401).json({message:"Not Allowed"});
    }

    note = await Notes.findByIdAndDelete(req.params.id)

    return res.status(200).json({message:"Note deleted successfully"})

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message:"Internal server error"});
    }
}

module.exports = deletenote
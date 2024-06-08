const Notes = require("../../models/Notes");

const removenotecollaborator = async (req, res) => {
    const note = await Notes.findById(req.params.id);
    if(!note) {
        return res.status(404).json({message: "Not Found"});
    }
    if(note.user.toString() !== req.user.id && !(note.collaborators.includes(req.user.id))) {
        return res.status(401).json({message:"Not Allowed"});
    }
    const collaboratorId = req.body.collaboratorId
    const collaboratorIndex = note.collaborators.indexOf(collaboratorId);
    if(collaboratorIndex === -1) {
        return res.status(404).json({message: "Not Found"});
    }
    note.collaborators.splice(collaboratorIndex, 1);
    await note.save();
    const populatedNote = await Notes.findById(req.params.id).populate('user').populate('collaborators');
    return res.status(200).json(populatedNote);
}

module.exports = removenotecollaborator
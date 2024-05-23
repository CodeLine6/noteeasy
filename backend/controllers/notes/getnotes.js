const Notes = require("../../models/Notes");

const getnotes = async (req, res) => {

    try {
        const notes = await Notes.find({  $or: [
            { user: req.user.id },
            { collaborators: req.user.id }
          ] }).populate('user').populate('collaborators');
        return res.json(notes)

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message:"Internal server error"});
    }
}

module.exports = getnotes
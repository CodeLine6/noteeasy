const { collaboratorInviteBody } = require("../../Email/Invite");
const transporter = require("../../Email/transporter");
const Invites = require("../../models/Invites");
const Notes = require("../../models/Notes");
const User = require("../../models/User");

const addnotecollaborator = async (req,res) => {
    const {collaboratorEmail} = req.body
    try {
         // find the note to be updated & update it
    const note = await Notes.findById(req.params.id);
    if(!note) {
        return res.status(404).json({message: "Not Found"});
    }
    // Allow updation only if user owns this note or is a collaborator of the note
    if(note.user.toString() !== req.user.id  && !(note.collaborators.includes(req.user.id))) {
        return res.status(401).json({message:"Not Allowed"});
    }

    const collaboratorDetails = await User.findOne({email: collaboratorEmail});
    if(collaboratorDetails) {
        note.collaborators.push(collaboratorDetails._id)
        await note.save()
    }
    else  {
        const invite = new Invites({
            noteId : note._id,
            collaboratorEmail
        })
        await invite.save();
    }

    const sharer = await User.findById(req.user.id);

        let message = {
            from: process.env.GMAIL_APP_USER, // sender address
            to: collaboratorEmail, // list of receivers
            subject: `Note shared with you: "${note.title}"`, // Subject line
            html: collaboratorInviteBody(sharer.name,sharer.email,note,collaboratorEmail, collaboratorDetails), // html body
        };

        transporter.sendMail(message).then(async (info) => {
            const updatedNote = await Notes.findById(note.id).populate('user').populate('collaborators')
            return res.status(200).json(updatedNote)
        }).catch((err) => {
            console.log(err)
            return res.status(500).json({ message: err.message });
        }
        );
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = addnotecollaborator
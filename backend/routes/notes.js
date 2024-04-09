const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchuser');
const Note = require('../models/Notes');
const User = require('../models/User');
const Invite = require('../models/Invites');
const { body, validationResult } = require('express-validator');
const {collaboratorInviteBody} = require("../Email/Invite");
const transporter = require('../Email/transporter');

// ROUTE 1: Get all notes using: GET "/api/notes" . Login required

router.get('/fetchallnotes', fetchUser, async (req, res) => {

    try {
        const notes = await Note.find({  $or: [
            { user: req.user.id },
            { collaborators: req.user.id }
          ] }).populate('user').populate('collaborators');
        return res.json(notes)

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message:"Internal server error"});
    }
})

// ROUTE 2: Add a new note using: POST "/api/notes/addnote" . Login required

router.post('/addnote', fetchUser, [
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
    // If there are errors, return Bad Request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ "errors": errors.array() });
    }

    const { title, description, tag } = req.body;

    try {
        const newNote = new Note({
            title, description, tag, user: req.user.id
        });

        let savedNote = await newNote.save();
        savedNote = await Note.findById(savedNote._id).populate('user').populate('collaborators')    
        return res.status(200).json(savedNote)

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message:"Internal server error"});
    }
})

// ROUTE 3: Update existing note using: PUT "/api/notes/updatenote" . Login required

router.put('/updatenote/:id', fetchUser, async (req, res) => {
    const {title,description,tag} = req.body;
    //create new note
    const newNote = {title,description,tag}

    try {
    
    // find the note to be updated & update it
    let note = await Note.findById(req.params.id);
    if(!note) {
        return res.status(404).json({message: "Not Found"});
    }
    // Allow updation only if user owns this note or is a collaborator of the note
    if(note.user.toString() !== req.user.id  && !(note.collaborators.includes(req.user.id))) {
        return res.status(401).json({message:"Not Allowed"});
    }

    note = await Note.findByIdAndUpdate(req.params.id,{$set: newNote}, {new: true})

    return res.status(200).json(note)

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message:"Internal server error"});
    }
});

router.put('/togglepin/:id', fetchUser, async (req, res) => {
    const {isPinned} = req.body;
    
    try {
    
    // find the note to be updated & update it
    let note = await Note.findById(req.params.id);
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
});

// ROUTE 4: Add collaborator to note using: PATCH "api/notes/addcollaborator/{note_id}" . Login required

router.patch('/addcollaborator/:id',fetchUser, async (req,res) => {
    const {collaboratorEmail} = req.body
    try {
         // find the note to be updated & update it
    const note = await Note.findById(req.params.id);
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
        const invite = new Invite({
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
            const updatedNote = await Note.findById(note._id).populate('user').populate('collaborators')
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
})


// ROUTE 5: Delete existing note using: DELETE "/api/notes/deletenote" . Login required

router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    
    try {
        
    // find the note to be deleted & delete it
    let note = await Note.findById(req.params.id);
    if(!note) {
        return res.status(404).json({message:"Not Found"});
    }
    // Allow deletion only if user owns this note
    if(note.user.toString() !== req.user.id) {
        return res.status(401).json({message:"Not Allowed"});
    }

    note = await Note.findByIdAndDelete(req.params.id)

    return res.status(200).json({message:"Note deleted successfully"})

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message:"Internal server error"});
    }
});

module.exports = router
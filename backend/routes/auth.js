const express = require('express');
const router = express.Router();
const { default: mongoose } = require('mongoose');
const User = require('../models/User');
const Note = require('../models/Notes');
const Invites = require('../models/Invites');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchuser');
const { forgetPassword,
    resetPassword } = require("../controllers/forgetPassword.controller.js");
    

// Centralized error handling middleware
const errorHandler = (res, message) => {
    console.error(message);
    return res.status(500).json({ message: "Internal server error" });
};

// Handle invites for new user
const handleInvites = async (user) => {
    const session = await mongoose.startSession();

    try {
        const invites = await Invites.find({ collaboratorEmail: user.email });
        const noteIds = invites.map(invite => invite.noteId);
        await Note.updateMany(
            { _id: { $in: noteIds } },
            { $push: { collaborators: user._id } }
        ).session(session);

        await Invites.deleteMany({ collaboratorEmail: user.email }).session(session);

        await session.commitTransaction();
    } catch (error) {
        throw new Error(error);
    }
};

// Route to create a new user
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }

        const { name, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User with email already exists" });
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        const authtoken = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET_KEY);
        
        //await handleInvites(user);

        return res.json({ authtoken });
    } catch (error) {
        return errorHandler(res, error.message);
    }
});

// Route to login a user
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Please try to login with correct credentials" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Please try to login with correct credentials" });
        }

        const authtoken = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET_KEY);
        //await handleInvites(user);

        return res.json({ authtoken });
    } catch (error) {
        return errorHandler(res, error.message);
    }
});

// Route to get logged in user details
router.post('/getuser', fetchUser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        return res.status(200).json(user);
    } catch (error) {
        return errorHandler(res, error.message);
    }
});

// Route to check user registration
router.post('/checkregistration', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        return res.status(200).json({ route: user ? "login" : "signup" });
    } catch (error) {
        return errorHandler(res, error.message);
    }
});

router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
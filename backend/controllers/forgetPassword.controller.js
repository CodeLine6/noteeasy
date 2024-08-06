const User = require('../models/User');
const jwt = require("jsonwebtoken");
const bycrypt = require("bcryptjs");
const transporter = require('../Email/transporter');
const { resetPasswordBody } = require('../Email/Invite');

const forgetPassword = async (req, res) => {
    try {
        // Find the user by email
        const user = await User.findOne({ email: req.body.email });
    
        // If user not found, send error message
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
    
        // Generate a unique JWT token for the user that contains the user's id
        const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET_KEY, {expiresIn: "10m",});
    
        // Send the token to the user's email
    
        // Email configuration
        const mailOptions = {
          from: process.env.ZOHO_EMAIL_ID,
          to: req.body.email,
          subject: "Reset Password",
          html: resetPasswordBody(user.name,token),
        };
    
        // Send the email
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            return res.status(500).json({ message: err.message });
          }
          res.status(200).send({ message: "Email sent" });
        });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
};

const resetPassword = async (req, res) => {
    try {
        // Verify the token sent by the user
        const decodedToken = jwt.verify(
          req.params.token,
          process.env.JWT_SECRET_KEY
        );
    
        // If the token is invalid, return an error
        if (!decodedToken) {
          return res.status(401).json({ message: "Invalid token" });
        }
    
        // find the user with the id from the token
        const user = await User.findOne({ _id: decodedToken.user.id });
        if (!user) {
          return res.status(401).json({ message: "no user found" });
        }
        
        // Hash the new password
        const salt = await bycrypt.genSalt(10);
        req.body.newPassword = await bycrypt.hash(req.body.newPassword, salt);
    
        // Update user's password, clear reset token and expiration time
        user.password = req.body.newPassword;
        await user.save();
    
        // Send success response
        res.status(200).send({ message: "Password updated" });
      } catch (err) {
        // Send error response if any error occurs
        res.status(500).json({ message: err.message });
      }
};

module.exports = {forgetPassword,resetPassword}
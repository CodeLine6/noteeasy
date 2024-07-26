const bcrypt = require('bcryptjs');
const { temporaryPasswordBody } = require('../../Email/Invite.js');

const transporter = require('../../Email/transporter.js');
const User = require('../../models/User.js');

module.exports = async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user exists in the database
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
            // Create new user if not exists
            let tempPassword = generateRandomPassword(8);
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(tempPassword, salt);

            user = new User({
                email: profile.emails[0].value,
                name: profile.displayName,
                password: hashedPassword
            });
            await user.save();

            // Email configuration
            const mailOptions = {
                from: process.env.GMAIL_APP_USER,
                to: user.email,
                subject: "Welcome to Noteseasy",
                html: temporaryPasswordBody(user.name, tempPassword),
            };

            transporter.sendMail(mailOptions, (err, info) => {
                /* if (err) {
                 return res.status(500).json({ message: err.message });
               }
               res.status(200).send({ message: "Email sent" });  */
            });
        }
        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
}

function generateRandomPassword(length) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}
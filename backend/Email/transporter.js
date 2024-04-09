const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtppro.zoho.in', // your email domain
    port: 465,
    secure: true, // use SSL
    auth: {
        user: process.env.GMAIL_APP_USER, // your email address
        pass: process.env.GMAIL_APP_PASSWORD // your password
    }
});

module.exports = transporter;
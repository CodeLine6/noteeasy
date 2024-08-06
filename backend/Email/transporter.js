const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtppro.zoho.in', // your email domain
    port: 465,
    secure: true, // use SSL
    auth: {
        user: process.env.ZOHO_EMAIL_ID, // your email address
        pass: process.env.ZOHO_EMAIL_PASSWORD // your password
    }
});

module.exports = transporter;
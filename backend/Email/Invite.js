var Mailgen = require('mailgen');
let MailGenerator = new Mailgen({theme: 'default',
product: {name: 'Noteseasy',
link: process.env.CLIENT_URL// this can be change according to your requirement     
}
});

// Define a function to generate the email body
const generateEmailBody = (name, intro, instructions, buttonColor, buttonText, buttonLink) => {
    const response = {
        body: {
            name,
            intro,
            action: {
                instructions,
                button: {
                    color: buttonColor,
                    text: buttonText,
                    link: buttonLink
                }
            }
        }
    }
    return MailGenerator.generate(response)
}

// Define the email body for collaborator invite
const collaboratorInviteBody = (senderName, senderEmail, note, collaboratorEmail, collaboratorDetails) => {
    const name = collaboratorDetails ? collaboratorDetails.name : collaboratorEmail;
    const intro = `${senderName} (${senderEmail}) shared a note with you.`;
    const instructions = note.title;
    const buttonColor = '#22BC66';
    const buttonText = 'Open in Noteseasy';
    const buttonLink = `${process.env.CLIENT_URL}/invite?note=${note._id}&user=${encodeURIComponent(collaboratorEmail)}`;
    return generateEmailBody(name, intro, instructions, buttonColor, buttonText, buttonLink);
}

// Define the email body for password reset
const resetPasswordBody = (name, token) => {
    const intro = `<p>The link will expire in 10 minutes.</p>
    <p>If you didn't request a password reset, please ignore this email.</p>`;
    const instructions = `Click on the following link to reset your password`;
    const buttonColor = '#22BC66';
    const buttonText = 'Reset Password';
    const buttonLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
    return generateEmailBody(name, intro, instructions, buttonColor, buttonText, buttonLink);
}

// Define the email body for temporary password
const temporaryPasswordBody = (name, password) => {
    const intro = `Welcome to Noteseasy. We've generated a temporary password for you which you can find below. We request you to update it as soon as possible`;
    const instructions = `Your temporary password : <b>${password}</b>`;
    const buttonColor = '#22BC66';
    const buttonText = 'Reset Password';
    const buttonLink = `${process.env.CLIENT_URL}/forget-password/`;
    return generateEmailBody(name, intro, instructions, buttonColor, buttonText, buttonLink);
}

module.exports = { collaboratorInviteBody, resetPasswordBody, temporaryPasswordBody }
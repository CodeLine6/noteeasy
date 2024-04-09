var Mailgen = require('mailgen');

let MailGenerator = new Mailgen({
    theme: 'default',
    product: {
        name: 'Noteseasy',
        link: 'https://noteseasy.online/'// this can be change according to your requirement
    }
});

const collaboratorInviteBody = (senderName,senderEmail,note,collaboratorEmail,collaboratorDetails) => {
    const response = {
        body: {
            name: collaboratorDetails ? collaboratorDetails.name : collaboratorEmail,
            intro: `${senderName} (${senderEmail}) shared a note with you.`,
            action: {
                instructions: note.title,
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Open in Noteseasy',
                    link: `https://noteseasy.online/invite?note=${note._id}&user=${encodeURIComponent(collaboratorEmail)}`
                }
            }
        }
    }
    return MailGenerator.generate(response)
}

const resetPasswordBody = (name,token) => {
    const response = {
        body: {
            name,
            intro: `<p>The link will expire in 10 minutes.</p>
            <p>If you didn't request a password reset, please ignore this email.</p>`,
            action: {
                instructions: `Click on the following link to reset your password`,
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Reset Password',
                    link: `${process.env.CLIENT_URL}/reset-password/${token}`
                }
            }
        }
    }
    return MailGenerator.generate(response)
}

const temporaryPasswordBody = (name,password) => {
    const response = {
        body: {
            name,
            intro: `Welcome to Noteseasy. We've generated a temporary password for you which you can find below. We request you to update it as soon as possible`,
            action: {
                instructions: `Your temporary password : <b>${password}</b>`,
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Reset Password',
                    link: `${process.env.CLIENT_URL}/forget-password/`
                }
            }
        }
    }
    return MailGenerator.generate(response)
}

module.exports = {collaboratorInviteBody,resetPasswordBody,temporaryPasswordBody}
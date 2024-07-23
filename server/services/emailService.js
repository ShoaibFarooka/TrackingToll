const nodemailer = require('nodemailer');

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_EMAIL_PASSWORD,
    },
});

const sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to,
            subject,
            text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info.messageId);
    } catch (error) {
        console.error('Error sending email: ', error);
    }
};

module.exports = { sendEmail };

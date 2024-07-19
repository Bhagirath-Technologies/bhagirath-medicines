const nodemailer = require('nodemailer');

const sendEmail = async (options) => {

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: `${options.email}`,
        subject: `${options.subject}`,
        html: `${options.message}`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.log(`Error occur while sending the email.`);
        throw new Error(err.message);
    }
};

module.exports = sendEmail; 

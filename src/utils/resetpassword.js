const crypto = require('crypto');
const nodemailer = require('nodemailer');
const configObject  = require('../config/config.js');
const { nodemailer: nodemail, nodepass } = configObject;




const generateResetToken = () => {
    return crypto.randomBytes(20).toString('hex');
};
const sendPasswordResetEmail = async (email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: nodemail,
                pass: nodepass
            }
        });

        const mailOptions = {
            from: 'testcoder50015@gmail.com',
            to: email,
            subject: 'Restablecer contraseña',
            html: `
                <p>Hola,</p>
                <p>Parece que has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para restablecerla:</p>
                <p><a href="http://localhost:8080/reset-password/${token}">Restablecer contraseña</a></p>
                <p>El enlace expirará en 1 hora.</p>
                <p>Si no solicitaste este restablecimiento, puedes ignorar este correo y tu contraseña seguirá siendo la misma.</p>
                <p>Muchas gracias.</p>
                <p>Tu equipo de soporte</p>
            `
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        throw new Error('Error al enviar el correo de restablecimiento de contraseña.');
    }
};

module.exports = { generateResetToken, sendPasswordResetEmail };

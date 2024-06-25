const nodemailer = require('nodemailer');
const configObject  = require('../config/config.js');
const { nodemail, nodepass } = configObject;

class EmailManager {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: nodemail,
                pass: nodepass
            }
        });
    }

    async enviarCorreoRestablecimiento(email, first_name, token) {
        try {
            const mailOptions = {
                from: 'testcoder50015@gmail.com',
                to: email,
                subject: 'Restablecimiento de Contraseña',
                html: `
                    <h1>Restablecimiento de Contraseña</h1>
                    <p>Hola ${first_name},</p>
                    <p>Has solicitado restablecer tu contraseña. Utiliza el siguiente código para cambiar tu contraseña:</p>
                    <p><strong>${token}</strong></p>
                    <p>Este código expirará en 1 hora.</p>
                    <a href="http://localhost:8080/password">Restablecer Contraseña</a>
                    <p>Si no solicitaste este restablecimiento, ignora este correo.</p>
                `
            };
            
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error("Error al enviar correo electrónico:", error);
            throw new Error("Error al enviar correo electrónico");
        }
    }

    async enviarCorreoEliminacion(email) {
        try {
            const mailOptions = {
                from: 'testcoder50015@gmail.com',
                to: email,
                subject: 'Eliminación de Cuenta',
                html: `
                    <h1>Eliminación de Cuenta</h1>
                    <p>Hola,</p>
                    <p>Tu cuenta ha sido eliminada debido a inactividad.</p>
                    <p>Si crees que esto ha sido un error, por favor contacta al soporte.</p>
                `
            };

            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error("Error al enviar correo electrónico", error);
            throw new Error("Error al enviar correo electrónico");
        }
    }

    async enviarCorreoEliminacionProducto(ownerEmail, productName) {
        try {
            const mailOptions = {
                from: 'testcoder50015@gmail.com',
                to: ownerEmail,
                subject: 'Producto Eliminado',
                html: `
                    <h1>Producto Eliminado</h1>
                    <p>Hola,</p>
                    <p>Nos gustaría informarte que tu producto <strong>${productName}</strong> ha sido eliminado de nuestro catálogo.</p>
                    <p>Si crees que esto ha sido un error o si tienes alguna pregunta, por favor contacta al soporte.</p>
                    <p>Gracias por utilizar nuestro servicio.</p>
                `
            };
    

            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error("Error al enviar correo electrónico:", error);
            throw new Error("Error al enviar correo electrónico");
        }
    }
}

module.exports = EmailManager;

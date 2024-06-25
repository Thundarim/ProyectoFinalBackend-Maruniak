const UserModel = require("../dao/models/users.model.js");
const CartModel = require("../dao/models/cart.model.js");
const jwt = require("jsonwebtoken");
const { createHash, isValidPassword } = require("../utils/hashBcrypt.js");
const UserDTO = require("../dto/user.dto.js");
const { generateResetToken } = require("../utils/tokenreset.js");
const EmailManager = require("../services/email.js");
const emailManager = new EmailManager();
const swal = require("sweetalert2");
const { usersService } = require ("../services/managment.js");

class UserController {
    constructor() {
        this.emailManager = new EmailManager();
    }
    
    async requestPasswordReset(req, res) {
        const { email } = req.body;

        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(404).send("Usuario no encontrado");
            }
            const token = generateResetToken();
            user.resetToken = {
                token: token,
                expiresAt: new Date(Date.now() + 3600000)
            };
            await user.save();
            await emailManager.enviarCorreoRestablecimiento(email, user.first_name, token);
            return res.redirect('/password');
        } catch (error) {
            console.error(error);
            res.status(500).send("Error interno del servidor");
        }
    }
    async deleteInactiveUsers() {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - 2);
    
            const usersToDelete = await UserModel.find({ last_connection: { $lt: cutoffDate } });
    
            for (const user of usersToDelete) {
                await this.emailManager.enviarCorreoEliminacion(user.email);
                await UserModel.deleteOne({ _id: user._id });
            }
    
            const deletedUserEmails = usersToDelete.map(user => user.email);
            return deletedUserEmails;
        } catch (error) {
            throw error;
        }
    }
    
    
    
    

    async getUserById(req, res) {
        const { uid } = req.params;
    
        try {
            const user = await UserModel.findById(uid);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }    
    async getAllUsers() {
        try {
            return await UserModel.find({});
        } catch (error) {
            throw new Error("Error fetching users");
        }
    }
    async createUser(req, res) {
        const { first_name, last_name, email, age, password } = req.body;

        try {
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: "User already exists" });
            }
            const newUser = new UserModel({
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                role: "usuario"
            });
            await newUser.save();

            res.status(201).json({ message: "Usuario creado", user: newUser });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
    async resetPassword(req, res) {
        const { email, password, token } = req.body;

        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.render("passwordcambio", { error: "Usuario no encontrado" });
            }
            const resetToken = user.resetToken;
            if (!resetToken || resetToken.token !== token) {
                return res.render("passwordreset", { error: "El token de restablecimiento de contraseña es inválido" });
            }
            const now = new Date();
            if (now > resetToken.expiresAt) {
                return res.redirect("/passwordcambio");
            }
            if (isValidPassword(password, user)) {
                return res.render("passwordcambio", { error: "La nueva contraseña no puede ser igual a la anterior" });
            }
            user.password = createHash(password);
            user.resetToken = undefined;
            await user.save();
            return res.redirect("/login");
        } catch (error) {
            console.error(error);
            return res.status(500).render("passwordreset", { error: "Error interno del servidor" });
        }
    }
    async cambiarRolPremium(req, res) {
        try {
            const { uid } = req.params;
    
            const user = await UserModel.findById(uid);
    
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
    
            const nuevoRol = user.role === 'usuario' ? 'premium' : 'usuario';
    
            const actualizado = await UserModel.findByIdAndUpdate(uid, { role: nuevoRol }, { new: true });
            res.json(actualizado);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
        
    }
}



module.exports = UserController;


module.exports = UserController;

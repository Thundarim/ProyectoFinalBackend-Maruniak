const express = require("express");
const router = express.Router();
const passport = require("passport");
const upload = require("../middleware/multer");
const UserController = require("../controller/user.controller");
const userController = new UserController();


router.post("/", async (req, res, next) => {
    try {
        passport.authenticate("register", async (err, user, info) => {
            if (err) return next(err);
            if (!user) return res.status(400).send({ status: "error", message: "Credenciales invalidas" });

            req.session.user = {
                first_name: user.first_name,
                last_name: user.last_name,
                age: user.age,
                email: user.email,
                role: user.role,
            };

            req.session.login = true;

            res.redirect("/profile");
        })(req, res, next);
    } catch (error) {
        next(error);
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await userController.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al hacer fetch a los users' });
    }
});

router.get("/:uid", userController.getUserById);
router.post("/requestPasswordReset", userController.requestPasswordReset);
router.post('/reset-password', userController.resetPassword);
router.put("/premium/:uid", userController.cambiarRolPremium);
router.post("/", userController.createUser);
router.delete("/", async (req, res) => {
    try {
        const deletedUsers = await userController.deleteInactiveUsers();
        res.json({ message: "Usuarios eliminados correctamente", deletedUsers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar usuarios inactivos" });
    }
});

module.exports = router;

router.get("/failedregister", (req, res) => {
    res.send({ error: "Registro fallido" });
});

module.exports = router;

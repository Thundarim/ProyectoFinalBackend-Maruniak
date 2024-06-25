const express = require("express");
const upload = require("../middleware/multer.js");
const isAuthenticated = require("../middleware/authenticate.js")
const router = express.Router();
const UserModel = require("../dao/models/users.model.js")

// Rutas para subida de archivos
router.post('/upload/profile', upload.single('profile'), (req, res) => {
    res.send('Profile image uploaded successfully');
});

router.post('/upload/product', upload.single('product'), (req, res) => {
    res.send('Product image uploaded successfully');
});

router.post('/upload/document', upload.single('document'), (req, res) => {
    res.send('Document uploaded successfully');
});

router.post('/users/documents', isAuthenticated, upload.array('document'), async (req, res) => {
    try {
        const userId = req.session.user._id;
        const documents = req.files.map(file => ({
            name: file.originalname,
            reference: `/uploads/documents/${file.filename}`
        }));
        await UserModel.findByIdAndUpdate(userId, { $push: { documents: { $each: documents } }, documentUploaded: true });

        res.status(200).send('Documentos subidos con éxito');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al subir documentos');
    }
});

module.exports = router;
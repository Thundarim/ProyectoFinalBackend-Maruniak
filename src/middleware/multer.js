const multer = require("multer");
const path = require("path");


// Configuracion de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = './uploads';

        if (file.fieldname === 'profile') {
            uploadPath = './uploads/profiles';
        } else if (file.fieldname === 'product') {
            uploadPath = './uploads/products';
        } else if (file.fieldname === 'document') {
            uploadPath = './uploads/documents';
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

module.exports = upload;

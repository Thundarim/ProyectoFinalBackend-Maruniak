const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    first_name: {
        type: String, 
        required: true
    },
    last_name : {
        type: String
    },
    email : {
        type: String, 
        required: true,
        index: true, 
        unique: true
    }, 
    password: {
        type: String, 
        required: true
    },
    age : {
        type: Number
    },
    role: {
        type: String,
        enum: ["usuario", "admin", "premium"],
        default: "usuario"
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cartCollection'
    },
    resetToken: {
        token: String,
        expiresAt: Date
    },
    documents: [{
        name: String,
        reference: String
    }],
    documentUploaded: {
        type: Boolean,
        default: false
    },
    last_connection: {
        type: Date
    }
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;

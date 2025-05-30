const mongoose = require('mongoose');

const userAuthorSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        enum: ['user', 'author', 'admin']
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profileImageUrl: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { strict: "throw" });

const userAuthor = mongoose.model('userAuthor', userAuthorSchema);

module.exports = userAuthor;

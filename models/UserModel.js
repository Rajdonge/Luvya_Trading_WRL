const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    token: {
        type: String,
        default: ''
    }
});

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;
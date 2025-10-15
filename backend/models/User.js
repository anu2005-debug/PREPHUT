const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    resetToken: { type: String },         // For forgot password
    resetTokenExpire: { type: Date }      // Token expiration
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
});

UserSchema.plugin(passportLocalMongoose);// Adds username and password fields

module.exports = mongoose.model('User', UserSchema);

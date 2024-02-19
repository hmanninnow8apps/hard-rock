const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    }, 
    password:{
        type: String
    },
    isAdmin:{
        type: Boolean,
        required: true
    },
    googleId:{
        type: String
    },
    cart:[{
        type: mongoose.Types.ObjectId,
        ref:'Cart'
    }]
})

const User = mongoose.model('User', userSchema);

module.exports = {User}
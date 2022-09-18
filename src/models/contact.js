const mongoose = require('mongoose');

const contact = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }
});

const newContact = new mongoose.model('contact',contact);

module.exports = newContact;
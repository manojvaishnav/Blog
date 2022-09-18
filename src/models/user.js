const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const user = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    blog:{
        type:Array,
        default:[]
    },
    password:{
        type:String,
        required:true
    }
});

user.pre('save', async function (next) {
    if (this.isModified('password')) {
        // console.log(`password before bcrypt ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10)
        // console.log(`password after bcrypt ${this.password}`);
    }

    next();
});

const newUser = new mongoose.model('user',user);

module.exports = newUser;
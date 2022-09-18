const mongoose = require('mongoose');

const blog = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true
    },
    post:{
        type:Array,
        default:[]
    }
});

const newBlog = new mongoose.model('blog',blog);

module.exports = newBlog;
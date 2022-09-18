const mongoose = require('mongoose');

const post = new mongoose.Schema({
    heading:{
        type:String,
        required:true
    },
    image:{
        type:String,
    },
    description:{
        type:String,
    },
    likes:{
        type:Array,
        default:[]
    },
    date:{
        type:String,
    }
});

const newPost = new mongoose.model('post',post);

module.exports = newPost;
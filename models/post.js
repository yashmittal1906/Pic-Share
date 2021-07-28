const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types    //ObjectId is a feature of mongoose so it has to be deconstructed. 
const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
    likes:[{type:ObjectId,ref:"User"}],
    comments:[{
        text:String,
        postedBy:{type:ObjectId,ref:"User"}
    }],
    postedBy:{
       type:ObjectId,
       ref:"User"             //Connect to user mongoose model
    }
},{timestamps:true})

mongoose.model("Post",postSchema)

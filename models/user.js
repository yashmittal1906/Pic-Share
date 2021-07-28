const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const userSchema = new mongoose.Schema({    //userSchema is name given by us
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken:String,
    expireToken:Date,
    pic:{
     type:String,
     default:"https://res.cloudinary.com/yashmittal19/image/upload/v1586197723/noimage_d4ipmd.png"
    },
    private:{
      type:Boolean,
      default:false
    },
    pendingRequest:[{type:Object,ref:"User"}],
    followers:[{type:ObjectId,ref:"User"}],               //The ref option is what tells Mongoose which model to use during population
    following:[{type:ObjectId,ref:"User"}]
})

mongoose.model("User",userSchema)  //rather than exporting,using this method.you have to require it in app.js

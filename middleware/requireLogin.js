const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const mongoose = require('mongoose')
const User = mongoose.model("User")
module.exports = (req,res,next)=>{
    const {authorization} = req.headers
    //authorization === Bearer ewefwegwrherhe             authorization will look like this
    //  you need to put Bearer up front to tell the server that what follows is an API token, and not something else.
    if(!authorization){
       return res.status(401).json({error:"you must be logged in"})
    }
    const token = authorization.replace("Bearer ","")         //replacing so that we can only access token
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
         return   res.status(401).json({error:"you must be logged in"})
        }

        const {_id} = payload
        User.findById(_id).then(userdata=>{
            req.user = userdata
            next()       //next should be inside otherwise we wont be able to get user_data
        })


    })
}
//JWT Signature=header+payload+secret=3 64-base-Url String
//Header contain algorithm used to sign  and type=JWT
//Payload sub,name,admin,etc info
//The signature is used to verify the message wasn't changed along the way, and, in the case of tokens signed with a private key, it can also verify that the sender of the JWT is who it says it is.

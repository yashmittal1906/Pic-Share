const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")    //This "User" name should be same as in user.js in models.
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const {SENDGRID_API,EMAIL} = require('../config/keys')



const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:SENDGRID_API
    }
}))

router.post('/signup',(req,res)=>{              //Signup details
  const {name,email,password,pic} = req.body
  if(!email || !password || !name){            // checking if all the fields are filled or not
     return res.status(422).json({error:"please add all the fields"})
  }
  User.findOne({email:email})                 //Checking if that email already exist
  .then((savedUser)=>{
      if(savedUser){
        return res.status(422).json({error:"user already exists with that email"})
      }
      bcrypt.hash(password,12)        //Hashing password 12 salt more the number more is the security
      .then(hashedpassword=>{
            const user = new User({           //Creating new user Schema for this user
                email,
                password:hashedpassword,
                name,
                pic
            })

            user.save()                       //Saving schema
            .then(user=>{
                transporter.sendMail({
                to: user.email,
                from: 'yashmittal1906@gmail.com',
                subject: 'signup success',
                html: '<h1>welcome to Pic-Share</h1>',
             });
               res.json({ message: 'saved successfully' })
            })
            .catch(err=>{
                console.log(err)
            })
      })

  })
  .catch(err=>{
    console.log(err)
  })
})


router.post('/signin',(req,res)=>{                   //Signin details
    const {email,password} = req.body
    if(!email || !password){                         //Checking email and password
       return res.status(422).json({error:"please add email or password"})
    }
    User.findOne({email:email})                //Checking if email is present or not
    .then(savedUser=>{                         //This savedUser contains whole database details of that user
        if(!savedUser){                        //If email does not exist
           return res.status(422).json({error:"Invalid Email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({message:"successfully signed in"})
               const token = jwt.sign({_id:savedUser._id},JWT_SECRET)     //sign method is used to generate token and token is generated based on userId which is unique
               const {_id,name,email,followers,following,pic,private,pendingRequest} = savedUser
               res.json({token,user:{_id,name,email,followers,following,pic,private,pendingRequest}})
            }
            else{
                return res.status(422).json({error:"Invalid Email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})


router.post('/reset-password',(req,res)=>{
     crypto.randomBytes(32,(err,buffer)=>{              //random string kind of
         if(err){
             console.log(err)
         }
         const token = buffer.toString("hex")
         User.findOne({email:req.body.email})
         .then(user=>{
             if(!user){
                 return res.status(422).json({error:"User dont exists with that email"})
             }
             user.resetToken = token
             user.expireToken = Date.now() + 3600000         //expire after a day for reset password
             user.save().then((result)=>{
                 transporter.sendMail({
                     to:user.email,
                     from:"yashmittal1906@gmail.com",
                     subject:"password reset",
                     html:`
                     <p>You requested for password reset</p>
                     <h5>click in this <a href="${EMAIL}/reset/${token}">link</a> to reset password</h5>
                     `
                 })
                 res.json({message:"check your email"})
             })

         })
     })
})


router.post('/new-password',(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})       //gt=greater than
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again session expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
           user.password = hashedpassword
           user.resetToken = undefined
           user.expireToken = undefined
           user.save().then((saveduser)=>{
               res.json({message:"password updated success"})
           })
        })
    }).catch(err=>{
        console.log(err)
    })
})


module.exports = router

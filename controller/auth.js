const User = require('../models/user')
const shortid = require('shortid')
const jwt = require('jsonwebtoken')
const expressjwt = require('express-jwt')
const Blog = require('../models/blog')
const _ = require('lodash')
const { errorHandler } = require('../helpers/dbErrorHandler')
const {OAuth2Client} = require('google-auth-library')


require('dotenv').config()
let API_KEY = process.env.MAILGUN_API_KEY;
let DOMAIN = process.env.APP_URL;
let mailgun = require('mailgun-js')({apiKey: API_KEY, domain: DOMAIN});

exports.presignup = (req,res)=>{
    const {name,email,password} = req.body
    User.findOne({email:email.toLowerCase()},(err,user)=>{
        if(user){
            return res.status(400).json({
                error:'email is taken'
            })
        }
        const token = jwt.sign({name,email,password},process.env.JWT_ACCOUNT_ACTIVATION,{expiresIn:'1d'})
        const data = {
           
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `account activation link link`,
           
            html:`
                 
                   <p>Please use the following link to activate your account:</p>
                   <p>${process.env.CLIENT_URL}/auth/account/activate/${token}</p>
                  
                   <hr/>
                   <p>This email may contain sensitive information </p>
                   <p>https://realFit.com</p>
    
                 `
          };
          mailgun.messages().send(data, (error, body) => {
            console.log(data)
          console.log(body)
          console.log(error)
         return  res.json({
              message:`email has been sent to ${email}. Follow the instructions to activate account`
          })
        });

    })

}

exports.signup = (req,res) =>{
    const token  =req.body.token
    if(token){
        jwt.verify(token,process.env.JWT_ACCOUNT_ACTIVATION, function(err,decoded){
            if(err){
                return res.status(401).json({
                    error:'expired link. sign up again'
                })
            }
            const {name,email,password} = jwt.decode(token)
            let username = shortid.generate()
               let profile = `${process.env.CLIENT_URL}/profile/${username}`
               const user = new User({name,email,password,profile,username})
               user.save((err,user) =>{
                if(err){
                                   return res.status(400).json({
                                         error:errorHandler(err)
                                     })
                                 }
                               return  res.json({
                                     message:'signup successful! please signin.'
                                 })

               })

        })
    }else{
        return  res.json({
            message:'something went wrong please try again'
        })


    }
}
exports.signin=(req,res)=>{


    const {email,password} = req.body

    User.findOne({email}).exec((err,user)=>{
        if(err || !user){
            return res.status(400).json({
                error:'user with that email does not exist. please signup'
            })
        }
        if(!user.authenticate(password)){
            return res.status(400).json({
                error:'email and password do not match.'
            })
        }
        const token = jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'})
        res.cookie('token' ,token,{expiresIn:'1d'})
        const {_id,username,name,email,role} = user
       return res.json({
           token,
           user: {_id,username,name,email,role}
       })

    })
  
}
exports.signout=(req,res)=>{
    res.clearCookie('token')
    res.json({
        message:'signout successful'
    })
}
exports.requireSignin = expressjwt({
    secret:process.env.JWT_SECRET,algorithms: ['HS256']
})
exports.authMiddleware = (req,res,next)=>{
    console.log(req.user)
    const authUserId = req.user._id
    User.findById({_id:authUserId}).exec((err,user)=>{
        if(err || !user){
            return res.status(400).json({
                error:'user not found'
            })
        }
        req.profile = user
        next()
    })
}
exports.adminMiddleware = (req,res,next)=>{
    const adminUserId = req.user._id
    User.findById({_id:adminUserId}).exec((err,user)=>{
        if(err || !user){
            return res.status(400).json({
                error:'user not found'
            })
        }

        if(user.role !== 1){
            return res.status(400).json({
                error:'Admin resource. Access denied.'
            })

        }
        req.profile = user
        next()
    })
}
exports.canUpdateDeleteBlog = (req,res,next) =>{
    const slug = req.params.slug.toLowerCase()
    Blog.findOne({slug}).exec((err,data)=>{
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        let authorizedUser = data.postedBy._id.toString() === req.profile._id.toString()
        if(!authorizedUser){
            return res.status(400).json({
                error: 'you are not authorized'
            })
        }
        next()
    })
}
exports.forgotPassword = (req,res) =>{
    const {email} = req.body
    User.findOne({email},(err,user)=>{
        if(err || !user){
            return res.status(400).json({
                error:'user with that email does not exist'
            })
        }
        const token = jwt.sign({_id:user._id},process.env.JWT_RESET_PASSWORD,{expiresIn:'15min'})
        const data = {
           
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `Password reset link`,
           
            html:`
                 
                   <p>Please use the following link to reset your password:</p>
                   <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                  
                   <hr/>
                   <p>This email may contain sensitive information </p>
                   <p>https://realFit.com</p>
    
                 `
          };
          
         
          return user.updateOne({resetPasswordLink:token},(err,success)=>{
              if(err){
                  return res.json({error:errorHandler(err)})
              }else{
                mailgun.messages().send(data, (error, body) => {
                    console.log(data)
                  console.log(body)
                  console.log(error)
                 return  res.json({
                      message:`email has been sent to ${email}. Follow the instructions to reset your password. link expires in 15min`
                  })
                });
              }
          })
    })
}
exports.resetPassword =(req,res) =>{
  const {resetPasswordLink, newPassword} = req.body
  jwt.verify(resetPasswordLink,process.env.JWT_RESET_PASSWORD, function(err,decoded){
      if(err){
          return res.status(401).json({
              error:'Expired link. Try again'
          })
      }
      User.findOne({resetPasswordLink},(err,user) =>{
          if(err || !user){
              return res.status(401).json({
                  error:'something went wrong. Try later'
              })
          }
          const updatedFields = {
              password: newPassword,
              resetPasswordLink:''
          }
          user = _.extend(user, updatedFields)
          user.save((err,result)=>{
              if(err){
                  return res.status(400).json({
                      error:errorHandler(err)
                  })
              }
              res.json({
                  message:`Great! now you can login with your new password`
              })
          })
      })
  })
}
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
exports.googleLogin = (req,res)=>{
    const idToken = req.body.tokenId
    client.verifyIdToken({idToken,audience:process.env.GOOGLE_CLIENT_ID}).then(response =>{

        const { email_verified,name,email,jti} = response.payload
        if(email_verified){
            User.findOne({email}).exec((err,user)=>{
                if(user){
                    const token = jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'})
                    res.cookie('token',token,{expiresIn:'1d'})
                    const {_id,email,name,role,username} = user
                    return res.json({token,user:{_id,email,name,role,username}})
                }else{
                    let username =shortid.generate()
                    let profile = `${process.env.CLIENT_URL}/profile/${username}`
                    let password = jti + process.env.JWT_SECRET
                    user = new User({name,email,profile,username,password})
                    user.save((err,data)=>{
                        if(err){
                            return res.status(400).json({
                                error:errorHandler(err)
                            })
                        }
                        const token = jwt.sign({_id:data._id},process.env.JWT_SECRET,{expiresIn:'1d'})
                        res.cookie('token',token,{expiresIn:'1d'})
                        const {_id,email,name,role,username} = data
                        return res.json({token,user:{_id,email,name,role,username}})
                    })
                }
            })
        }else{
            return res.status(400).json({
                error:'google login failed.try again'
            })
        }
    })
   

}











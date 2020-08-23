const express = require('express');
const {signup,signin,signout, requireSignin,forgotPassword,resetPassword, presignup,googleLogin, adminMiddleware} = require('../controller/auth')
const { userValidationRules, validate,signinValidationRules,signinvalidate ,
    forgotPasswordValidationRules,
    forgotPasswordvalidate,
    resetPasswordValidationRules,
    resetPasswordvalidate,


} = require('../validation')


const router = express.Router();
router.post('/pre-signup',userValidationRules(),validate, requireSignin  , adminMiddleware, presignup)
router.post('/signup',signup)
router.post('/signin',signinValidationRules(),signinvalidate, signin)
router.get('/signout',signout)
router.put('/forgot-password',forgotPasswordValidationRules(),forgotPasswordvalidate, forgotPassword)
router.put('/reset-password',  resetPasswordValidationRules(),
resetPasswordvalidate, resetPassword)
router.post('/google-login', googleLogin)



module.exports = router
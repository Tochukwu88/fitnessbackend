const express = require('express');
const { requireSignin,authMiddleware} = require('../controller/auth')
const {read,publicProfile,update,photo} = require('../controller/user')


const router = express.Router();

router.get('/user/profile',requireSignin,authMiddleware,read)
router.get('/user/:username',publicProfile)

router.put('/user/update',requireSignin,authMiddleware,update)
router.get('/user/photo/:username',photo)




module.exports = router
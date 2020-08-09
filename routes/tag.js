const express = require('express');
const { requireSignin,adminMiddleware} = require('../controller/auth')
const { create,list,read,remove} = require('../controller/tag')
const { tagRules, tagvalidate } = require('../validation')

const router = express.Router();
router.post('/tag',tagRules(),tagvalidate,requireSignin,adminMiddleware, create)
router.get('/tags',list)
router.get('/tag/:slug',read)
router.delete('/tag/:slug',requireSignin,adminMiddleware,remove)




module.exports = router
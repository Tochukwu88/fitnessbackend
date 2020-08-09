const express = require('express');
const { requireSignin,adminMiddleware} = require('../controller/auth')
const { create,list,read,remove} = require('../controller/category')
const { categoryRules, categoryvalidate } = require('../validation')

const router = express.Router();
router.post('/category',categoryRules(),categoryvalidate,requireSignin,adminMiddleware, create)
router.get('/categories',list)
router.get('/category/:slug',read)
router.delete('/category/:slug',requireSignin,adminMiddleware,remove)




module.exports = router
const express = require('express');

const { contactForm,contactBlogAuthorForm} = require('../controller/form')
const {  contactValidationRules ,
    contactvalidate } = require('../validation')

const router = express.Router();
router.post('/contact', contactValidationRules() ,
contactvalidate, contactForm)
router.post('/contact-blog-author', contactValidationRules() ,
contactvalidate, contactBlogAuthorForm)





module.exports = router
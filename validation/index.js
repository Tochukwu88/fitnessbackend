const { body, check, validationResult } = require('express-validator')
const userValidationRules = () => {
  return [
    // check('name'," name is required.")
    // .notEmpty().isString(),
    check('name','name is required').notEmpty().withMessage('name is required'),
    check('email','email is required').notEmpty().isEmail().withMessage('email must contain @'),
    
    check('password','password is required').notEmpty().isLength({ min: 6 })
    .withMessage('password must contain 6 characters')
    .matches(/\d/)
    .withMessage('password must contain a number'),
  ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}
const signinValidationRules = () => {
  return [
    
    check('email','email is required').notEmpty().isEmail().withMessage('email must contain @'),
    
    check('password','password is required').notEmpty().isLength({ min: 6 })
    .withMessage('password must contain 6 characters')
    .matches(/\d/)
    .withMessage('password must contain a number'),
  ]
}

const signinvalidate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}



const categoryRules = () => {
  return [
    check('name','name is required').notEmpty().withMessage('name is required'),
  ]
}

const categoryvalidate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}
const tagRules = () => {
  return [
    check('name','name is required').notEmpty().withMessage('name is required'),
  ]
}

const tagvalidate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}
const contactValidationRules = () => {
  return [
    check('name','name is required').notEmpty().withMessage('name is required'),
    
    check('email','email is required').notEmpty().isEmail().withMessage('email must be valid'),
    
    check('message','message is required').notEmpty().isLength({ min: 20 })
    .withMessage('message must be 20 characters long'),
    
  ]
}

const contactvalidate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}
const forgotPasswordValidationRules = () => {
  return [
    
    check('email','email is required').notEmpty().isEmail().withMessage('email must contain @'),
    
    
  ]
}

const forgotPasswordvalidate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}
const resetPasswordValidationRules = () => {
  return [
    
  
    check('newPassword','Password is required').notEmpty().isLength({ min: 6 })
    .withMessage('password must contain 6 characters')
    // .matches(/\d/)
    // .withMessage('password must contain a number'),
  ]
}

const resetPasswordvalidate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}
module.exports = {
  userValidationRules,
  categoryRules,
  signinValidationRules,
  signinvalidate,
  validate,
  categoryvalidate,
  tagRules,
  tagvalidate,
  contactValidationRules ,
  contactvalidate,
  forgotPasswordValidationRules,
  forgotPasswordvalidate,
  resetPasswordValidationRules,
  resetPasswordvalidate,
}
       
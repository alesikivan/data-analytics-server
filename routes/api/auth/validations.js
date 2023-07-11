import { check, validationResult } from 'express-validator'

export const hubspotLogin = [
  check('name', 'Name can not be empty.')
    .notEmpty()
    .custom(username => !!username.trim()),

  check('surname', 'Surname can not be empty.')
    .notEmpty()
    .custom(password => !!password.trim()),

  check('email', 'Email can not be empty.')
    .notEmpty(),
  check('email', 'Email has invalid format.')
    .isEmail(),

  check('gender', 'Gender can not be empty.')
    .notEmpty(),
  check('gender', 'Gender has invalid format.')
    .custom(gender => ['Male', 'Female', 'Diverse'].includes(gender)),

  check('type', 'Client type can not be empty.')
    .notEmpty(),
  check('type', 'Client type has invalid format.')
    .custom(gender => ['Company', 'Student'].includes(gender)),

  (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.errors[0].msg
      })
    }

    next()
  },
]

export const login = [
  check('login', 'Login cannot be empty.').notEmpty().trim(),
  check('password', 'Password cannot be empty.').notEmpty().trim(),

  (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.errors[0].msg
      })
    }

    next()
  },
]
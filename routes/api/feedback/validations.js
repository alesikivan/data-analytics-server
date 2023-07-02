import { check, validationResult } from 'express-validator'

export const resumeUpload = [
  check('name', 'Name cannot be empty.').notEmpty().trim(),
  check('surname', 'Surname cannot be empty.').notEmpty().trim(),
  check('coveringLetter', 'Covering letter cannot be empty.').notEmpty().trim(),
  check('email', 'Email cannot be empty.').notEmpty(),
  check('email', 'Email has an invalid format.').isEmail(),

  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' })
    }

    next()
  },

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
import { Router } from 'express'

import controller from '../../../controllers/authController.js'
import { hubspotLogin, login } from './validations.js'

const router = new Router()

router.post(
  '/login', 
  login,
  controller.login
)

router.post(
  '/hubspot-login', 
  hubspotLogin,
  controller.hubspotLogin
)

export default router
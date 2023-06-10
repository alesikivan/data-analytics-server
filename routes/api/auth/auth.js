import { Router } from 'express'

import controller from '../../../controllers/authController.js'
import { hubspotLogin } from './validations.js'

const router = new Router()

router.post(
  '/hubspot-login', 
  hubspotLogin,
  controller.hubspotLogin
)

export default router
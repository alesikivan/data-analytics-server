import { Router } from 'express'

import controller from '../../../controllers/contentController.js'
import authMiddleware from '../../../middlewares/auth.js'
import { ROLES } from '../../../db/roles.js'

const router = new Router()

router.get(
  '/languages', 
  controller.getLanguages
)

router.put(
  '/languages/update', 
  authMiddleware(ROLES.ADMIN),
  controller.setLanguages
)

export default router
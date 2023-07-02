import { Router } from 'express'

import controller from '../../../controllers/contentController.js'

const router = new Router()

router.get(
  '/languages', 
  controller.getLanguages
)

export default router
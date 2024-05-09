import { Router } from 'express'
import multer from 'multer'

import controller from '../../../controllers/newsController.js'

const router = new Router()

const upload = multer({ dest: 'uploads/resume/' })

router.get(
  '/', 
  controller.getNews
)

router.post(
  '/get-news', 
  controller.getNewsById
)

router.post(
  '/create', 
  controller.createNews
)

router.post(
  '/update', 
  controller.updateNews
)

router.post(
  '/remove', 
  controller.removeNews
)

export default router
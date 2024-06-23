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

router.get(
  '/current-news-amount', 
  controller.getCurrentNewsAmount
)

router.post(
  '/resave-news-order', 
  controller.resaveNewsOrder
)

router.post(
  '/remove', 
  controller.removeNews
)

export default router
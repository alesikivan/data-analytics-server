import { Router } from 'express'
import multer from 'multer'

import controller from '../../../controllers/feedbackController.js'
import { resumeUpload } from './validations.js'

const router = new Router()

const upload = multer({ dest: 'uploads/resume/' })

router.post(
  '/resume', 
  [upload.single('resume'), ...resumeUpload],
  controller.uploadResume
)

export default router
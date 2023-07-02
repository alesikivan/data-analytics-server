import express from 'express'

import authRouter from './api/auth/auth.js'
import contentRouter from './api/content/content.js'
import feedbackRouter from './api/feedback/feedback.js'

const router = express.Router()

router.use('/auth', authRouter)
router.use('/content', contentRouter)
router.use('/feedback', feedbackRouter)

export default router
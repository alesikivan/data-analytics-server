import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import config from 'config'

const app = express()
const PORT = config.get('APP.PORT')

import routes from './routes/index.js'
import docsController from './controllers/docsController.js'

// Настройки
app.use(express.json({ limit: '50mb' }))
app.use(cors())

// Роуты приложения
app.use('/api', routes)

app.use('/api/docs/privacy-policy', docsController.getPrivacyPolicy)

app.use('/api/docs/data-processing-consent', docsController.getDataProcessingConsent)

app.use(express.static('./client/dist'))

app.get('*', async (req, res) => {
  const filePath = path.join(process.cwd(), 'client', 'dist', 'index.html');

  const file = fs.existsSync(filePath)

  if (!file) return res.status(400).json({ message: 'Invalid index file' })

  return res.sendFile(filePath)
})

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Success server has started on port ${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}

startServer()





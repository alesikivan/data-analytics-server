import path from 'path'
import fs from 'fs'

class docsController {
  async getPrivacyPolicy(req, res) {
    try {
      const filePath = path.join(
        process.cwd(), 'static', 'docs', 'pdf', 'MUNI_Security_Policy.pdf'
      )

      const file = fs.existsSync(filePath)
      if (!file) return res.status(400).json({ message: 'Invalid index file' })

      return res.status(200).sendFile(filePath)
    } catch (error) { 
      console.log(error)
      return res.status(400).json({ message: 'Undefined server error' })
    }
  }
}

export default new docsController()
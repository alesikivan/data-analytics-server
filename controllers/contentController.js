import fs from 'fs'
import path from 'path'

class contentController {
  async getLanguages(req, res) {
    try {
      const cs = await getLanguage('cs.json')
      const en = await getLanguage('en.json')

      return res.status(200).json({ cs, en })
    } catch (error) { 
      console.log(error)
      return res.status(400).json({ message: 'Undefined server error' })
    }
  }
}

function getLanguage(filename) {
  const filePath = path.join(process.cwd(), 'static', 'languages', filename)

  return new Promise(resolve => {
    fs.readFile(filePath, 'utf8', (err, json) => {
      if (err) {
        console.log(err)
        return resolve(null)
      }

      resolve(JSON.parse(json))
    })
  })
}

export default new contentController()
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

  async setLanguages(req, res) {
    try {
      const { en, cs } = req.body
  
      // Сохраняем данные в формате JSON
      fs.writeFileSync(path.join(process.cwd(), 'static', 'languages', 'en.json'), JSON.stringify(en, null, 2))
      fs.writeFileSync(path.join(process.cwd(), 'static', 'languages', 'cs.json'), JSON.stringify(cs, null, 2))
  
      return res.status(200).json({ message: 'Data saved successfully' })
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
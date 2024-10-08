import path from 'path'
import { readFile, writeFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { v4 as uuidv4 } from 'uuid'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class NewsController {
  async getNews(req, res) {
    try {
      const filePath = path.join(__dirname, '../db/data/news.json')
      const data = await readFile(filePath, 'utf8')

      let news = JSON.parse(data)

      return res.status(200).json(news)

      // Добавляем порядок тем новостям, 
      // которые их не содержат по каким-либо причинам

      // news = news.map(_news => {
      //   if (!_news.order) _news.order = 0

      //   return _news
      // })
      // return res.status(200).json(news.sort((a, b) => a.order - b.order ))

    } catch (error) {
      console.log(error)
      return res.status(400).json({ message: 'Undefined server error' })
    }
  }

  async getNewsById(req, res) {
    try {
      const {
        id = '',
      } = req.body

      const filePath = path.join(__dirname, '../db/data/news.json');
      const data = await readFile(filePath, 'utf8')

      const news = JSON.parse(data)

      const candidate = news.find(news => news.id === id)

      if (!candidate)
        return res.status(400).json({ message: 'Can not find the news.' })

      return res.status(200).json(candidate)
    } catch (error) {
      console.log(error)
      return res.status(400).json({ message: 'Undefined server error' })
    }
  }

  async createNews(req, res) {
    try {
      const {
        title = '',
        img = '',
        date = '',
        content = '',
        order = 0
      } = req.body

      const filePath = path.join(__dirname, '../db/data/news.json');
      const data = await readFile(filePath, 'utf8')

      const json = JSON.parse(data)

      const newItem = {
        title, img, date, content, order,
        id: uuidv4()
      }

      // Запись обновленного содержимого обратно в JSON-файл
      await writeFile(filePath, JSON.stringify([newItem, ...json], null, 2), 'utf8')

      return res.status(200).json({ message: 'The news has been successfully saved.' })
    } catch (error) {
      console.log(error)
      return res.status(400).json({ message: 'Undefined server error' })
    }
  }

  async updateNews(req, res) {
    try {
      const {
        id = '',
        title = '',
        img = '',
        date = '',
        content = '',
        order = 0
      } = req.body

      const filePath = path.join(__dirname, '../db/data/news.json')
      const data = await readFile(filePath, 'utf8')

      const json = JSON.parse(data)

      if (!json.find(news => news.id === id))
        return res.status(400).json({ message: 'Can not find the news.' })

      const newItem = {
        title, img, date, content, order
      }

      const items = json.map(news => {
        if (news.id === id) {
          news = { ...news, ...newItem }
        }

        return news
      })

      // Запись обновленного содержимого обратно в JSON-файл
      await writeFile(filePath, JSON.stringify(items, null, 2), 'utf8')

      return res.status(200).json({ message: 'The news has been successfully updated.' })
    } catch (error) {
      console.log(error)
      return res.status(400).json({ message: 'Undefined server error' })
    }
  }

  async getCurrentNewsAmount(req, res) {
    try {

      const filePath = path.join(__dirname, '../db/data/news.json')
      const data = await readFile(filePath, 'utf8')

      const news = JSON.parse(data)

      console.log(news.length)

      return res.status(200).json({ amount: Number(news.length) })
    } catch (error) {
      console.log(error)
      return res.status(400).json({ message: 'Undefined server error' })
    }
  }

  async resaveNewsOrder(req, res) {
    try {
      const {
        ids = [],
      } = req.body

      const filePath = path.join(__dirname, '../db/data/news.json')
      const data = await readFile(filePath, 'utf8')

      const news = JSON.parse(data)

      // Создаем объект для быстрого доступа к объектам по id
      const newsMap = news.reduce((acc, obj) => {
        acc[obj.id] = obj
        return acc
      }, {})

      // Создаем новый массив объектов, отсортированный по idArray
      const sortedNews = ids.map(id => newsMap[id])

      // Запись обновленного содержимого обратно в JSON-файл
      await writeFile(filePath, JSON.stringify(sortedNews, null, 2), 'utf8')

      return res.status(200).json({ message: 'The news has been successfully resaved.' })
    } catch (error) {
      console.log(error)
      return res.status(400).json({ message: 'Undefined server error' })
    }
  }

  async removeNews(req, res) {
    try {
      const {
        id = '',
      } = req.body

      const filePath = path.join(__dirname, '../db/data/news.json')
      const data = await readFile(filePath, 'utf8')

      const json = JSON.parse(data)

      if (!json.find(news => news.id === id))
        return res.status(400).json({ message: 'Can not find the news.' })

      const items = json.filter(news => news.id !== id)

      // Запись обновленного содержимого обратно в JSON-файл
      await writeFile(filePath, JSON.stringify(items, null, 2), 'utf8')

      return res.status(200).json({ message: 'The news has been successfully removed.' })
    } catch (error) {
      console.log(error)
      return res.status(400).json({ message: 'Undefined server error' })
    }
  }
}

export default new NewsController()
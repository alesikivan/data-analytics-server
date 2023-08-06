import config from 'config'
import { Client } from "@hubspot/api-client"
import nodemailer from 'nodemailer'
import { getLanguage } from './contentController.js'

import { generateAccessToken } from '../utils/jwt.js'
import { confirmResumeUpload } from './feedbackController.js'

class authController {
  async hubspotLogin(req, res) {
    try {
      const { name, surname, email, gender, type } = req.body

      const hubspotClient = new Client({ accessToken: config.get('APP.HUBSPOT_API_KEY') })

      const contactData = {
        email: email,
        firstname: name,
        lastname: surname,
        gender: gender,
        email_subscription: 'subscribed',
        client_type: type,
        hs_legal_basis: "Legitimate interest – existing customer"
      }

      try {
        const creating = await hubspotClient.crm.contacts.basicApi.create({ properties: contactData })

        const transporter = nodemailer.createTransport({
          host: config.get('MAIL.SMTP_HOST'),
          port: config.get('MAIL.SMTP_PORT'),
          secure: true,
          auth: {
            user: config.get('MAIL.SMTP_EMAIL'),
            pass: config.get('MAIL.SMTP_PASSWORD'),
          }
        })

        const en = await getLanguage('en.json')
        const message = en['Email-Register-Response']
        const title = 'Successful registration'

        const confirmTransporting = await confirmResumeUpload(transporter, email.trim(), title, message)

        if (!confirmTransporting) {
          console.log('Error Email-Register-Response')
        }

        return res.status(200).json({ message: 'Data has been successfully saved!' })
      } catch (error) {
        return res.status(400).json({ message: 'Error creating account. Please try with other data.' })
      }
      
    } catch (error) { 
      console.log(error)
      return res.status(400).json({ message: 'Undefined server error' })
    }
  }

  async login(req, res) {
    try {
      const { login, password } = req.body
 
      if (login !== config.get('ADMIN.LOGIN')) {
        return res.status(400).json({ message: 'Invalid login data or user does not exist'})
      }

      if (password !== config.get('ADMIN.PASSWORD')) {
        return res.status(400).json({ message: 'Invalid login data or user does not exist'})
      }
      
      const token = generateAccessToken()
      
      return res.status(200).json({ token, message: 'You have successfully logged into the system!' })
    }
    catch (error) {
      console.log(error)
      return res.status(400).json({ message: translater('serverFatal') })
    }
  }
}

export default new authController()
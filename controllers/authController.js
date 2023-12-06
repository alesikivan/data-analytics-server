import config from 'config'
import { Client } from "@hubspot/api-client"
import nodemailer from 'nodemailer'

import { generateAccessToken } from '../utils/jwt.js'
import { confirmResumeUpload } from './feedbackController.js'
import { isUserEmailExist } from '../utils/hubspot.js'
import axios from 'axios'

class authController {
  async hubspotLogin(req, res) {
    try {
      const { name, surname, email, gender, type, companyName, companyScope } = req.body

      const hubspotClient = new Client({ accessToken: config.get('APP.HUBSPOT_API_KEY') })

      const userExistence = await isUserEmailExist(email)

      if (userExistence)
        return res.status(400).json({ message: 'An account with this name already exists.' })

      const contactData = {
        email: email,
        firstname: name,
        lastname: surname,
        gender: gender,
        email_subscription: 'subscribed',
        client_type: type,
        hs_legal_basis: "Legitimate interest – existing customer",
        company: type === 'Student' ? '' : companyName,
        company_scope: type === 'Student' ? '' : companyScope
      }

      try {
        // axios.get(
        //   'https://api.hubapi.com/crm/v3/properties/contacts',
        //   {
        //     headers: {
        //       'Authorization': `Bearer ${config.get('APP.HUBSPOT_API_KEY')}`
        //     }
        //   }
        // )
        //   .then((response) => {
        //     const properties = response.data.results;
        //     properties.forEach(property => {
        //       console.log(`Name: ${property.name}`);
        //       console.log(`Type: ${property.type}`);
  
        //       if (property.type === 'enumeration') {
        //         const options = property.options.map(option => option.label);
        //         console.log(`Options: ${options.join(', ')}`);
        //       }
        //     });
        //   })

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

        const message = `A new user with email ${email} has been successfully registered in Hubspot!`
        const title = 'New MDA candidate (sign-up page)'

        const confirmTransporting = await confirmResumeUpload(transporter, email.trim(), title, message)

        return res.status(200).json({ message: 'Data has been successfully saved!' })
      } catch (error) {
        console.log('hubspotLogin', error)
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
        return res.status(400).json({ message: 'Invalid login data or user does not exist' })
      }

      if (password !== config.get('ADMIN.PASSWORD')) {
        return res.status(400).json({ message: 'Invalid login data or user does not exist' })
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
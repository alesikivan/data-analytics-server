import { validationResult } from 'express-validator'
import { Client } from "@hubspot/api-client"
import dotenv from 'dotenv'
dotenv.config()

class authController {
  async hubspotLogin(req, res) {
    try {
      const errors = validationResult(req)
      
      if (!errors.isEmpty()) {
        const error = errors.errors[0].msg

        return res.status(400).json({ message: error })
      }    

      const { name, surname, email, gender } = req.body

      const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_API_KEY })

      const contactData = {
        email: email,
        firstname: name,
        lastname: surname,
        gender: gender,
        email_subscription: 'subscribed'
      }

      // Create a contact
      hubspotClient.crm.contacts.basicApi
        .create({ properties: contactData })
        .then(() => {
          res.status(200).json({ message: 'Data has been successfully saved!' })
        })
        .catch((error) => {
          const { 
            body: { message }
          } = JSON.parse(JSON.stringify(error))

          console.log(message)
          
          res.status(400).json({ message })
        })
      
    } catch (error) { 
      console.log(error)
      return res.status(400).json({ message: 'Undefined server error' })
    }
  }
}

export default new authController()
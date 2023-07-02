import { validationResult } from 'express-validator'
import config from 'config'
import { Client } from "@hubspot/api-client"

class authController {
  async hubspotLogin(req, res) {
    try {
      const errors = validationResult(req)
      
      if (!errors.isEmpty()) {
        const error = errors.errors[0].msg

        return res.status(400).json({ message: error })
      }

      const { name, surname, email, gender, type } = req.body

      const hubspotClient = new Client({ accessToken: config.get('APP.HUBSPOT_API_KEY') })

      const contactData = {
        email: email,
        firstname: name,
        lastname: surname,
        gender: gender,
        email_subscription: 'subscribed',
        client_type: type
      }

      try {
        const creating = await hubspotClient.crm.contacts.basicApi.create({ properties: contactData })
        return res.status(200).json({ message: 'Data has been successfully saved!' })
      } catch (error) {
        return res.status(400).json({ message: 'Error creating account. Please try with other data.' })
      }
      
    } catch (error) { 
      console.log(error)
      return res.status(400).json({ message: 'Undefined server error' })
    }
  }
}

export default new authController()
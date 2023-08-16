import config from 'config'
import nodemailer from 'nodemailer'
import fs from 'fs'
import { Client } from "@hubspot/api-client"

import { isUserEmailExist } from '../utils/hubspot.js'

class feedbackController {
  async uploadResume(req, res) {
    try {
      const {
        name,
        surname,
        email,
        coveringLetter
      } = req.body

      const hubspotClient = new Client({ accessToken: config.get('APP.HUBSPOT_API_KEY') })

      const userExistence = await isUserEmailExist(email)

      // Если аккаунта нет в Hubspot, то завести его там
      if (!userExistence) {
        // Сохранение в Hubspot
        const contactData = {
          email: email,
          firstname: name,
          lastname: surname,
          gender: 'Diverse',
          email_subscription: 'subscribed',
          client_type: 'Student',
          hs_legal_basis: "Legitimate interest – existing customer"
        }

        try {
          const creating = await hubspotClient.crm.contacts.basicApi.create({ properties: contactData })
        } catch (error) {
          console.log(error)
        }
      }

      // Отправка на почту
      const transporter = nodemailer.createTransport({
        host: config.get('MAIL.SMTP_HOST'),
        port: config.get('MAIL.SMTP_PORT'),
        secure: true,
        auth: {
          user: config.get('MAIL.SMTP_EMAIL'),
          pass: config.get('MAIL.SMTP_PASSWORD'),
        }
      })

      const resumeTransporting = await sendResume(transporter, req.file.destination, req.file.path, { email, name, surname, coveringLetter })

      if (!resumeTransporting) {
        return res.status(400).json({ message: 'Error submitting resume. Please try again.' })
      }

      return res.status(200).json({ message: 'Resume and covering letter was successfully sent.' })
    } catch (error) {
      console.log(error)
      return res.status(400).json({ message: 'Undefined server error' })
    }
  }

  async contactUs(req, res) {
    try {
      const {
        name,
        surname,
        email,
        question
      } = req.body

      const hubspotClient = new Client({ accessToken: config.get('APP.HUBSPOT_API_KEY') })

      const userExistence = await isUserEmailExist(email)

      // Если аккаунта нет в Hubspot, то завести его там
      if (!userExistence) {
        // Сохранение в Hubspot
        const contactData = {
          email: email,
          firstname: name,
          lastname: surname,
          gender: 'Diverse',
          email_subscription: 'subscribed',
          client_type: 'Student',
          hs_legal_basis: "Legitimate interest – existing customer"
        }

        try {
          const creating = await hubspotClient.crm.contacts.basicApi.create({ properties: contactData })
        } catch (error) {
          console.log(error)
        }
      }

      // Отправка на почту
      const transporter = nodemailer.createTransport({
        host: config.get('MAIL.SMTP_HOST'),
        port: config.get('MAIL.SMTP_PORT'),
        secure: true,
        auth: {
          user: config.get('MAIL.SMTP_EMAIL'),
          pass: config.get('MAIL.SMTP_PASSWORD'),
        }
      })


      const message = `The user with email ${email} has a question!<br /><b>Question:</b> ${question}`
      const title = 'Question – Contact Us Form'

      const confirmTransporting = await confirmResumeUpload(transporter, email.trim(), title, message)

      if (!confirmTransporting) {
        return res.status(400).json({ message: 'Failed to submit your question. Please try again later.' })
      }

      return res.status(200).json({ message: 'Resume and covering letter was successfully sent.' })
    } catch (error) {
      console.log(error)
      return res.status(400).json({ message: 'Undefined server error' })
    }
  }
}

function sendResume(transporter, resumeFile, resumePath, { email, name, surname, coveringLetter }) {
  return new Promise(resolve => {
    // Переименовываем файл
    const newPath = `${resumeFile}${'file.pdf'}`
    fs.renameSync(resumePath, newPath)


    const styles = `
      font-family: Arial;color: #000;font-size: 15px;
    `

    const html = `
      <p style="${styles}"> <b>Resume of a person with mail:</b> ${email} </p>
      <p style="${styles}"> <b>Covering Letter:</b>  </p>
      <pre style="${styles}">${coveringLetter}</pre>
    `

    const mailOptions = {
      from: config.get('MAIL.SMTP_EMAIL'),
      to: [config.get('MAIL.DESTINATION'), config.get('MAIL.DESTINATION_COPY')],
      subject: 'Resume for the MDA',
      html,
      attachments: [
        {
          filename: 'resume.pdf',
          path: newPath,
        }
      ],
    }

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error)
        resolve(false)
      }

      resolve(true)
    })
  })
}

export function confirmResumeUpload(transporter, email, title, message) {
  return new Promise(async resolve => {

    const styles = `
      font-family: Arial; color: #000; font-size: 15px;
    `

    const html = message

    const mailOptions = {
      from: config.get('MAIL.SMTP_EMAIL'),
      to: [config.get('MAIL.DESTINATION'), config.get('MAIL.DESTINATION_COPY')],
      subject: title,
      html: `<pre style="${styles}">${html}</pre>`
    }

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error)
        resolve(false)
      }

      resolve(true)
    })
  })
}

export default new feedbackController()
import config from 'config'
import nodemailer from 'nodemailer'
import fs from 'fs'
import { getLanguage } from './contentController.js'

class feedbackController {
  async uploadResume(req, res) {
    try {
      const {
        name,
        surname,
        email,
        coveringLetter
      } = req.body

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

      // const en = await getLanguage('en.json')
      // const message = en['Email-Resume-Response']
      // const title = 'Successful submission of resume'

      // const confirmTransporting = await confirmResumeUpload(transporter, email.trim(), title, message)

      // if (!confirmTransporting) {
      //   console.log('Error with Email-Resume-Response')
      // }

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
      <p style="${styles}"> <b>Email:</b> ${email} </p>
      <p style="${styles}"> <b>Name:</b> ${name} </p>
      <p style="${styles}"> <b>Surname:</b> ${surname} </p>
      <p style="${styles}"> <b>Covering Letter:</b>  </p>
      <pre style="${styles}">${coveringLetter}</pre>
    `

    const mailOptions = {
      from: config.get('MAIL.SMTP_EMAIL'),
      to: config.get('MAIL.DESTINATION'),
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
      to: config.get('MAIL.DESTINATION'),
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
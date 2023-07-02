import config from 'config'
import nodemailer from 'nodemailer'
import fs from 'fs'

class feedbackController {
  async uploadResume(req, res) {
    try {
      const { 
        name,
        surname,
        email,
        coveringLetter
      } = req.body

      // Переименовываем файл
      const newPath = `${req.file.destination}${'file.pdf'}`
      fs.renameSync(req.file.path, newPath)

      const transporter = nodemailer.createTransport({
        host: config.get('MAIL.SMTP_HOST'),
        port: config.get('MAIL.SMTP_PORT'),
        secure: true,
        auth: {
          user: config.get('MAIL.SMTP_EMAIL'),
          pass: config.get('MAIL.SMTP_PASSWORD'),
        }
      })

      const mailOptions = {
        from: config.get('MAIL.SMTP_EMAIL'),
        to: config.get('MAIL.DESTINATION'),
        subject: 'Resume',
        html: `
          <b>Email:</b> ${email}
          <br/>
          <b>Name:</b> ${name}
          <br/>
          <b>Surname:</b> ${surname}
          <br/>
          <b>Covering Letter:</b> ${coveringLetter}
        `,
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
          return res.status(400).json({ message: 'Error submitting resume. Please try again.' })
        } else {
          return res.status(200).json({ message: 'Resume and covering letter was successfully sent.' })
        }
      })
    } catch (error) { 
      console.log(error)
      return res.status(400).json({ message: 'Undefined server error' })
    }
  }
}

export default new feedbackController()
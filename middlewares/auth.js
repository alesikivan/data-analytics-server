import jwt from 'jsonwebtoken'
import config from 'config'

export default function (roles) {
  return async function (req, res, next) {
    if (req.method === 'OPTION') next()

    try {
      let token = req.headers.authorization

      if (!token)
        return res.status(401).json({ message: 'Invalid token' })

      token = token.split(' ')[1]

      if (!token)
        return res.status(401).json({ message: 'Invalid token' })

      jwt.verify(token, config.get('APP.JWT_SECRET_KEY'), async (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: 'Session timed out', code: 401 })
        }

        // Проверяем роль
        const { roles: userRoles } = jwt.verify(token, config.get('APP.JWT_SECRET_KEY'))
        let hasRole = false
        userRoles.forEach(role => {
          if (roles.includes(role.title))
            hasRole = true
        })

        if (!hasRole) {
          return res.status(401).json({ message: 'You do not have access to this aciton.' })
        }

        next()
      })
    } catch (error) {
      console.log(error)
      return res.status(401).json({ message: 'Server auth error' })
    }
  }
}
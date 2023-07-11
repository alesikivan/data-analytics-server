import config from 'config'
import jwt from 'jsonwebtoken'

export function generateAccessToken() {
  const payload = {
    login: 'admin',
    roles: [
      {
        _id: '0',
        title: 'Administrator'
      }
    ]
  }

  return jwt.sign(payload, config.get('APP.JWT_SECRET_KEY'), { expiresIn: '14d' })
}

export function getUserByToken(authorization) {
  try {
    if (!authorization) return false
    
    // Slice `Bearer`
    const token = authorization.split(' ')[1]
    const user = jwt.verify(token, config.get('APP.JWT_SECRET_KEY'))
    
    return user
  } catch (error) {
    return false
  }
}
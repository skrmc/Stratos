import type { Context } from 'hono'
import { authService } from '../services/authService.js'
import log from '../config/logger.js'

export const authController = {
  register: async (c: Context) => {
    try {
      const { username, email, password } = await c.req.json()
      const result = await authService.registerUser(username, email, password)
      log.info(`User registered successfully: ${email}`)
      return c.json(result)
    } catch (error) {
      log.error('Registration failed:', error)
      return c.json({ error: `Registration failed: ${error}` }, 500)
    }
  },

  login: async (c: Context) => {
    try {
      const { email, password } = await c.req.json()
      const result = await authService.loginUser(email, password)
      log.info(`User logged in successfully: ${email}`)
      return c.json(result)
    } catch (error) {
      log.error('Login failed:', error)
      return c.json({ error: `Login failed: ${error}` }, 500)
    }
  },
  getMe: async (c: Context) => {
    try {
      // The user data is attached to the request by the auth middleware
      const user = c.get('user')

      if (!user || !user.userId) {
        log.error('Get me error: No user in context')
        return c.json({ error: 'Unauthorized' }, 401)
      }

      const userData = await authService.getUserById(user.userId)
      return c.json(userData)
    } catch (error) {
      log.error('Get me error:', error)
      return c.json({ error: 'Failed to retrieve user data' }, 500)
    }
  },
}

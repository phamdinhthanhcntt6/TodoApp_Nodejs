import { Router } from 'express'
import { getProfile, login, refreshToken, register, registerUser, verifyCode } from '~/controllers/auth.controller'

const router = Router()

router.post('/send-otp', register)
router.post('/verify-otp', verifyCode)
router.post('/register', registerUser)
router.post('/login', login)
router.post('/refresh-token', refreshToken)
router.get('/profile', getProfile)

export default router

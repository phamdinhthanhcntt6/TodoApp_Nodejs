import { Router } from 'express'
import { login, register, registerUser, verifyCode } from '~/controllers/user.controller'

const router = Router()

router.post('/send-otp', register)
router.post('/verify-otp', verifyCode)
router.post('/register', registerUser)
router.post('/login', login)

export default router

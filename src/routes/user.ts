import { Router } from 'express'
import { register, registerUser, verifyCode } from '~/controllers/user.controller'

const router = Router()

router.post('/send-otp', register)
router.post('/verify-otp', verifyCode)
router.post('/register', registerUser)

export default router

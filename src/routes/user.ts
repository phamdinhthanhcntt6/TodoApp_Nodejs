import { Router } from 'express'
import { register, verifyCode } from '~/controllers/user.controller'

const router = Router()

router.post('/send-otp', register)
router.post('/verify-otp', verifyCode)

export default router

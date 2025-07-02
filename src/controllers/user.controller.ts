import { Request, Response } from 'express'
import Otp from '~/models/otp.model'
import User from '~/models/user.model'
import sendOTP from '~/utils/sendOTP'
import VerifiedEmail from '~/models/verifiedEmail.model'

const register = async (req: Request, res: Response) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (user) {
      res.status(400).json({
        message: 'Email already exists'
      })
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 1 * 60 * 1000)

    await Otp.deleteMany({ email })
    await Otp.create({ email, code, expiresAt })
    await sendOTP(email, code)
    res.status(200).json({
      message: 'Verification code sent to email'
    })
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      error
    })
  }
}

const verifyCode = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body

    const otpRecord = await Otp.findOne({ email, code })
    if (!otpRecord) {
      res.status(400).json({ message: 'Invalid verification code' })
      return
    }

    if (otpRecord.expiresAt < new Date()) {
      res.status(400).json({ message: 'Verification code expired' })
      return
    }

    await VerifiedEmail.create({ email })
    await Otp.deleteMany({ email })

    res.status(200).json({ message: 'OTP verified successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

export { register, verifyCode }

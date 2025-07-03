import { Request, Response } from 'express'
import Otp from '~/models/otp.model'
import User from '~/models/user.model'
import sendOTP from '~/utils/sendOTP'
import VerifiedEmail from '~/models/verifiedEmail.model'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

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
      await Otp.deleteMany({ email })
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

const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body

    const isVerified = await VerifiedEmail.findOne({ email })
    if (!isVerified) {
      res.status(400).json({ message: 'Email not verified' })
      return
    }

    const user = await User.findOne({ email })
    if (user) {
      res.status(400).json({ message: 'Email already exists' })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({ email, password: hashedPassword, username })

    await VerifiedEmail.deleteOne({ email })

    res.status(200).json({
      message: 'Registered successfully',
      user: newUser
    })
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      error
    })
  }
}

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      res.status(400).json({ message: 'Invalid email or password' })
      return
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid email or password' })
      return
    }

    const payload = { userId: user._id, email: user.email }

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '15m' })

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '7d' })

    res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username
      }
    })
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      error
    })
  }
}

const refreshToken = (req: Request, res: Response) => {
  const { refreshToken } = req.body
  if (!refreshToken) {
    res.status(401).json({ message: 'Missing refresh token' })
    return
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as {
      userId: string
      email: string
    }

    const newAccessToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '15m' }
    )

    res.json({ accessToken: newAccessToken })
  } catch (error) {
    res.status(403).json({ message: 'Invalid refresh token', error })
  }
}

export { register, verifyCode, registerUser, login, refreshToken }

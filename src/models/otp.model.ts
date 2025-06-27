import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema({
  email: String,
  code: String,
  expiresAt: Number
})

const Opt = mongoose.model('otp', otpSchema)
export default Opt

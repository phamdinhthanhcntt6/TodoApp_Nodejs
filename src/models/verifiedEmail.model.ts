// models/verifiedEmail.model.ts
import mongoose from 'mongoose'

const VerifiedEmailSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true }
  },
  { timestamps: true }
)

export default mongoose.model('verifiedEmail', VerifiedEmailSchema)

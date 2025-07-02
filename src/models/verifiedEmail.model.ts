// models/verifiedEmail.model.ts
import mongoose from 'mongoose'

const VerifiedEmailSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    createAt: {
      type: Date,
      default: Date.now,
      expires: 300
    }
  },
  { timestamps: true }
)

export default mongoose.model('verifiedEmail', VerifiedEmailSchema)

import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    // avatar: {
    //   type: String
    // },
    // role: {
    //   type: String,
    //   default: 'user'
    // }
  },
  {
    timestamps: true
  }
)

const User = mongoose.model('user', userSchema)
export default User

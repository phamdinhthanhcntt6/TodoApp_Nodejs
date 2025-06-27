import nodemailer from 'nodemailer'

const sendOTP = async (to: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })
  await transporter.sendMail({
    from: `"TodoApp" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'OTP for verification',
    text: `Your OTP is ${otp}`,
    html: `<p>Your OTP is <b>${otp}</b></p>`
  })
}

export default sendOTP

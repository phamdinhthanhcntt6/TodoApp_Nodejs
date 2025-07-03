import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import userRouter from './routes/auth'

import cookieParser from 'cookie-parser'

dotenv.config()

const app = express()
app.use(cookieParser())

app.use(cors())
app.use(express.json())

app.use('/auth', userRouter)

export default app

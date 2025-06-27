import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import userRouter from './routes/user'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/user', userRouter)

export default app

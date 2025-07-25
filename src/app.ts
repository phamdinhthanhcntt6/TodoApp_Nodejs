import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import userRouter from './routes/auth'
import taskListRouter from './routes/taskList'

dotenv.config()

const app = express()
app.use(cookieParser())

app.use(cors())
app.use(express.json())

app.use('/auth', userRouter)
app.use('/task-list', taskListRouter)

export default app

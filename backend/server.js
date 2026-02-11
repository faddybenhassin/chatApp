import express from 'express'
import { port } from './config/keys.js'
import userRouter from './routes/users.js'
import messageRouter from './routes/message.js'
import authRouter from './routes/auth.js'
import connectDB from './config/db.js'
import cors from 'cors'

const app = express()
const PORT = port

app.use(express.json())
app.use(cors())
connectDB()

app.use('/api/users', userRouter)
app.use('/api/message', messageRouter)
app.use('/api/auth', authRouter)

app.listen(PORT, () => {
  console.info(`Server is running on http://localhost:${PORT}`)
})

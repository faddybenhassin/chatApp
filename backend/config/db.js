import { mongoURI } from './keys.js'
import mongoose from 'mongoose'

export default async function connectDB() {
  try {
    const conn = await mongoose.connect(mongoURI)
    console.info(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}
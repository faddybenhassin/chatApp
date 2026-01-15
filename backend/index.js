import express from 'express'
import authRouter from './src/routes/auth.route.js'
import messageRouter from './src/routes/message.route.js'
import dotenv from 'dotenv'
import connectDB from './src/lib/db.js';
import cookieParser from "cookie-parser"
dotenv.config()


const app = express(); // Create an Express application instance
const PORT = process.env.PORT || 5000; // Define the port number



app.use(express.json());
app.use(cookieParser())
// Mount the router
app.use('/api/auth', authRouter);
app.use('/api/message', messageRouter);

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);
  connectDB()
});
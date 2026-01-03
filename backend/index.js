import express from 'express'
import authRouter from './src/routes/auth.route.js'


const app = express(); // Create an Express application instance
const PORT = 5000; // Define the port number


app.use(express.json());

// Mount the router
app.use('/auth', authRouter);

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);
});
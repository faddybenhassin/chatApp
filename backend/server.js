import express from 'express'
import { createServer } from "http"
import { Server } from "socket.io"
import { port } from './config/keys.js'
import userRouter from './routes/users.js'
import messageRouter from './routes/message.js'
import authRouter from './routes/auth.js'
import connectDB from './config/db.js'
import cors from 'cors'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  }
});

const PORT = port

app.use(express.json())
app.use(cors())
app.use((req, res, next) => {
  req.io = io;
  next();
});
connectDB()


app.use('/api/users', userRouter)
app.use('/api/message', messageRouter)
app.use('/api/auth', authRouter)

const distPath = path.join(__dirname, '../frontend/dist'); 

// 1. Serve static files from Vite's dist folder
app.use(express.static(distPath));

// 2. Catch-all: Route all other requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});


io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  socket.on("leave_room", (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room: ${roomId}`);

    // Optional: Tell others in the room that someone left
    // socket.to(roomId).emit("user_left", { userId: socket.id });
  });

  // socket.onAny((eventName, ...args) => {
  //   console.log(`Event Received: ${eventName}`, args);
  // });


});

httpServer.listen(PORT,'0.0.0.0', () => {
  console.info(`Server is running on http://localhost:${PORT}`)
})

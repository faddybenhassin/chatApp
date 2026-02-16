import { io } from 'socket.io-client';

export const socket = io(import.meta.env.VITE_API_URL, {
  autoConnect: false, // Best practice: connect manually when needed
});

// Debug: log any event emitted from the server
socket.onAny((eventName, ...args) => {
console.log(`Event Received: ${eventName}`, args);
});

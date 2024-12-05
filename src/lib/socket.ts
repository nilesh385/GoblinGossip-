import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

let socket: Socket | null = null;

export const initializeSocket = (token: string) => {
  if (socket) return socket;

  socket = io(import.meta.env.VITE_API_URL, {
    auth: { token },
  });

  socket.on('connect', () => {
    console.log('Connected to socket server');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
    toast.error('Connection error. Please try again.');
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

export default {
  initializeSocket,
  disconnectSocket,
  getSocket,
};
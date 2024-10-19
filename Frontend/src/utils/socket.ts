import io from 'socket.io-client';

const socket = io('https://goop-u38l.onrender.com', {
  transports: ['websocket'],
  });

export default socket;

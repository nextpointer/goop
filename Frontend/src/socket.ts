import io from 'socket.io-client';

const socket = io('https://goop-ufl2.onrender.com', {
    transports: ['websocket'],
  });



// Rest of the code remains the same
export default socket;
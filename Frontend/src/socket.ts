import io from 'socket.io-client';

const socket = io('ws://localhost:3000',{
    timeout: 15000,
    withCredentials: true,
    reconnectionDelayMax: 10000,
    transports: ['websocket', 'polling'],
});

export default socket;

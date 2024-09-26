import { io } from 'socket.io-client';

const URL = import.meta.env.MODE === 'production' ? undefined : 'http://localhost:3000';

const socket = io(URL, {
    autoConnect: false
})

socket.on('connect', () => {
    console.log('Connected to server');
})

socket.on('disconnect', () => {
    console.log('Disconnected from server');
})

socket.onAny((event, ...args) => {
    console.log(event, args);
})

export default socket;
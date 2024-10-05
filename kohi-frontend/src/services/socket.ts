import { io } from 'socket.io-client';
import { toast } from 'sonner';

const URL = import.meta.env.MODE === 'production' ? undefined : 'http://localhost:3000';

const socket = io(URL, {
    autoConnect: false
})

socket.on('connect', () => {
    if (import.meta.env.DEV) {
        toast.success('[DEBUG] Socket', {
            description: 'Đã kết nối đến server.'
        })
    }
})

socket.on('disconnect', () => {
    if (import.meta.env.DEV) {
        toast.warning('[DEBUG] Socket', {
            description: 'Ngắt kết nối đến server.'
        })
    }
})

socket.onAny((event, ...args) => {
    console.log("Hi chat")
    if (import.meta.env.DEV) {
        toast.message(`[DEBUG] Socket msg: ${event}`, {
            description: JSON.stringify(args)
        })
    }
})

export default socket;
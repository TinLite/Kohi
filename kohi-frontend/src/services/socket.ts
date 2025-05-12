import { io } from "socket.io-client";

const URL =
  import.meta.env.MODE === "production"
    ? undefined
    : import.meta.env.VITE_BACKEND_BASE_URL;

const socket = io(URL, {
  autoConnect: false,
  withCredentials: true,
});

socket.on("connect", () => {
  if (import.meta.env.DEV) {
    console.log("[DEBUG] Socket", {
      description: "Đã kết nối đến server.",
    });
  }
});

socket.on("disconnect", (reason) => {
  if (import.meta.env.DEV) {
    console.log("[DEBUG] Socket", {
      description: "Ngắt kết nối đến server. Lý do: " + reason,
    });
  }
});

socket.onAny((event, ...args) => {
  console.log("Hi chat");
  console.log("[DEBUG] Socket", event, args);
  if (import.meta.env.DEV) {
  }
});

export default socket;

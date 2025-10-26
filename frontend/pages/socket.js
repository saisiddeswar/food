// src/socket.js
import { io } from "socket.io-client";

const socket = io("https://annasamarpan-backend.onrender.com", { autoConnect: false });
export default socket;
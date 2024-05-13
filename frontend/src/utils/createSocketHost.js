import { io } from "socket.io-client";
import { HOST_URL } from "./loadEnv";

const socket = io(HOST_URL);

export { socket };

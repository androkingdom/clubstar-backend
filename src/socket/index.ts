import { Server as IOServer } from "socket.io";
import { Server as HttpServer } from "http";
import { registerSocketHandlers } from "./handlers/root";
import envConfig from "../config/env";

export let io: IOServer;

export const initSocket = (server: HttpServer) => {
  io = new IOServer(server, {
    cors: {
      origin: envConfig.CORS_ORIGIN,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);
    registerSocketHandlers(io, socket);
  });

  console.log("⚡ Socket.IO initialized");
  return io;
};

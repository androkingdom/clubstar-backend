import { Server, Socket } from "socket.io";
import { registerRoomHandlers } from "./rooms";

export const registerSocketHandlers = (io: Server, socket: Socket) => {
  registerRoomHandlers(socket); //
  socket.on("message:send", (payload) => {
    console.log("📥 message:send ->", payload);
    io.emit("message:receive", {
      ...payload,
      from: socket.id,
      timestamp: Date.now(),
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
  });
};

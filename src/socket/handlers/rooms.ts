import { Socket } from "socket.io";

export const registerRoomHandlers = (socket: Socket) => {
  socket.on("room:join", ({ slug }) => {
    console.log(`🟢 ${socket.id} joining room: ${slug}`);
    socket.join(slug); // ✅ Join the club's "room" using the slug
    socket.emit("room:joined", { slug }); // Optional ack back to client
  });

  socket.on("room:leave", ({ slug }) => {
    console.log(`🔴 ${socket.id} leaving room: ${slug}`);
    socket.leave(slug); // ✅ Leave the room
    socket.emit("room:left", { slug });
  });
};

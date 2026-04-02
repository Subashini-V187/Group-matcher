let ioInstance = null;

export function initSocket(io) {
  ioInstance = io;

  io.on('connection', (socket) => {
    socket.on('join-room', ({ groupId }) => {
      if (groupId) {
        socket.join(`group:${groupId}`);
      }
    });

    socket.on('leave-room', ({ groupId }) => {
      if (groupId) {
        socket.leave(`group:${groupId}`);
      }
    });
  });
}

export function getSocket() {
  return ioInstance;
}

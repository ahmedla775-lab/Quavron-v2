import socket, {
  connect,
  disconnect,
} from "../services/SignalingService";

class SignalingClient {
  connect() {
    connect();
  }

  disconnect() {
    disconnect();
  }

  joinRoom(roomId, userId) {
    socket.emit("join-room", {
      roomId,
      userId,
    });
  }

  leaveRoom(roomId, userId) {
    socket.emit("leave-room", {
      roomId,
      userId,
    });
  }

  sendSignal(roomId, signal) {
    socket.emit("signal", {
      roomId,
      signal,
    });
  }

  startLive(roomId) {
    socket.emit("live-start", {
      roomId,
    });
  }

  endLive(roomId) {
    socket.emit("live-end", {
      roomId,
    });
  }

  updateViewers(roomId, viewers) {
    socket.emit("viewer-update", {
      roomId,
      viewers,
    });
  }

  onSignal(callback) {
    socket.on("signal", callback);
  }

  onUserJoined(callback) {
    socket.on("user-joined", callback);
  }

  onUserLeft(callback) {
    socket.on("user-left", callback);
  }

  onViewerUpdate(callback) {
    socket.on("viewer-update", callback);
  }

  onLiveStarted(callback) {
    socket.on("live-start", callback);
  }

  onLiveEnded(callback) {
    socket.on("live-end", callback);
  }

  removeAllListeners() {
    socket.removeAllListeners();
  }
}

export default new SignalingClient();

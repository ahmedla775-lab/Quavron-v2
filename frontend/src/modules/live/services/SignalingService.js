import { io } from "socket.io-client";

const SERVER =
  import.meta.env.VITE_SIGNAL_SERVER ??
  "http://localhost:3001";

class SignalingService {
  constructor() {
    this.socket = io(SERVER, {
      autoConnect: false,
      transports: ["websocket"],
    });
  }

  connect() {
    if (!this.socket.connected) {
      this.socket.connect();
    }
  }

  disconnect() {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }

  joinRoom(roomId) {
    this.socket.emit("join-room", roomId);
  }

  leaveRoom(roomId) {
    this.socket.emit("leave-room", roomId);
  }

  sendOffer(roomId, offer) {
    this.socket.emit("offer", {
      roomId,
      offer,
    });
  }

  sendAnswer(roomId, answer) {
    this.socket.emit("answer", {
      roomId,
      answer,
    });
  }

  sendCandidate(roomId, candidate) {
    this.socket.emit("candidate", {
      roomId,
      candidate,
    });
  }

  on(event, callback) {
    this.socket.on(event, callback);
  }

  off(event, callback) {
    this.socket.off(event, callback);
  }

  getSocket() {
    return this.socket;
  }
}

export default new SignalingService();

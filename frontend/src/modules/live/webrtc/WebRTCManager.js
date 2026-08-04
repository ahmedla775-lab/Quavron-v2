import WebRTCService from "../services/WebRTCService";
import SignalingService from "../services/SignalingService";

class WebRTCManager {
  constructor() {
    this.roomId = null;
    this.peer = null;
  }

  async createHost(roomId, stream) {
    this.roomId = roomId;

    SignalingService.connect();

    this.peer = WebRTCService.createPeer(
      true,
      stream,
    );

    WebRTCService.connect(roomId, this.peer);

    this.peer.on("signal", (signal) => {
      SignalingService.sendOffer(
        roomId,
        signal,
      );
    });

    SignalingService.on(
      "answer",
      ({ answer }) => {
        this.peer.signal(answer);
      },
    );

    SignalingService.on(
      "candidate",
      ({ candidate }) => {
        this.peer.signal(candidate);
      },
    );

    return this.peer;
  }

  async createViewer(roomId, stream) {
    this.roomId = roomId;

    SignalingService.connect();

    this.peer = WebRTCService.createPeer(
      false,
      stream,
    );

    WebRTCService.connect(roomId, this.peer);

    this.peer.on("signal", (signal) => {
      SignalingService.sendAnswer(
        roomId,
        signal,
      );
    });

    SignalingService.on(
      "offer",
      ({ offer }) => {
        this.peer.signal(offer);
      },
    );

    SignalingService.on(
      "candidate",
      ({ candidate }) => {
        this.peer.signal(candidate);
      },
    );

    return this.peer;
  }

  replaceStream(stream) {
    if (!this.roomId) return;

    WebRTCService.replaceStream(
      this.roomId,
      stream,
    );
  }

  disconnect() {
    if (!this.roomId) return;

    WebRTCService.disconnect(
      this.roomId,
    );

    SignalingService.disconnect();

    this.peer = null;
    this.roomId = null;
  }
}

export default new WebRTCManager();

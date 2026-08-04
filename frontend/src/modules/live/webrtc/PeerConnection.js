import Peer from "simple-peer";

export default class PeerConnection {
  constructor({ initiator = false, stream = null } = {}) {
    this.peer = new Peer({
      initiator,
      trickle: false,
      stream,
    });
  }

  onSignal(callback) {
    this.peer.on("signal", callback);
  }

  onConnect(callback) {
    this.peer.on("connect", callback);
  }

  onStream(callback) {
    this.peer.on("stream", callback);
  }

  onData(callback) {
    this.peer.on("data", callback);
  }

  onClose(callback) {
    this.peer.on("close", callback);
  }

  onError(callback) {
    this.peer.on("error", callback);
  }

  signal(data) {
    this.peer.signal(data);
  }

  send(data) {
    if (this.peer.connected) {
      this.peer.send(data);
    }
  }

  addStream(stream) {
    stream.getTracks().forEach((track) => {
      this.peer.addTrack(track, stream);
    });
  }

  replaceStream(stream) {
    const senders = this.peer._pc?.getSenders?.() ?? [];

    stream.getTracks().forEach((track, index) => {
      if (senders[index]) {
        senders[index].replaceTrack(track);
      }
    });
  }

  destroy() {
    this.peer.destroy();
  }
}

import Peer from "simple-peer";

class WebRTCService {
  constructor() {
    this.peers = new Map();
  }

  createPeer(initiator, stream) {
    return new Peer({
      initiator,
      trickle: false,
      stream,
    });
  }

  connect(roomId, peer) {
    this.peers.set(roomId, peer);
    return peer;
  }

  getPeer(roomId) {
    return this.peers.get(roomId);
  }

  disconnect(roomId) {
    const peer = this.peers.get(roomId);

    if (peer) {
      peer.destroy();
      this.peers.delete(roomId);
    }
  }

  destroy(roomId) {
    this.disconnect(roomId);
  }

  addTrack(roomId, track, stream) {
    const peer = this.peers.get(roomId);

    if (peer && track) {
      peer.addTrack(track, stream);
    }
  }

  removeTrack(roomId, track, stream) {
    const peer = this.peers.get(roomId);

    if (peer && track) {
      peer.removeTrack(track, stream);
    }
  }

  replaceStream(roomId, newStream) {
    const peer = this.peers.get(roomId);

    if (!peer || !newStream) return;

    const tracks = newStream.getTracks();

    tracks.forEach((track) => {
      const sender = peer._pc
        ?.getSenders()
        ?.find((s) => s.track?.kind === track.kind);

      if (sender) {
        sender.replaceTrack(track);
      }
    });
  }

  clear() {
    this.peers.forEach((peer) => peer.destroy());
    this.peers.clear();
  }
}

export default new WebRTCService();

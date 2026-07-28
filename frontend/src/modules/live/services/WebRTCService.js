import Peer from "simple-peer";

class WebRTCService {

  createPeer(initiator, stream) {

    return new Peer({

      initiator,

      trickle: false,

      stream,

    });

  }

}

export default new WebRTCService();

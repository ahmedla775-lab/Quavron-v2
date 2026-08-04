class LiveService {
  constructor() {
    this.rooms = new Map();
  }

  createRoomId() {
    return (
      "live_" +
      Date.now().toString(36) +
      "_" +
      Math.random().toString(36).slice(2, 8)
    );
  }

  async createLive(config = {}) {
    const roomId = this.createRoomId();

    const room = {
      id: roomId,
      status: "created",
      createdAt: Date.now(),

      hostId: config.hostId ?? null,
      title: config.title ?? "Live",

      category: config.category ?? "public",
      plan: config.plan ?? "FREE",
      quality: config.quality ?? "480p",

      viewers: 0,
      bandwidth: 0,
      timer: 0,

      recording: true,
      replay: false,
    };

    this.rooms.set(roomId, room);

    return room;
  }

  async startLive(roomId) {
    const room = this.rooms.get(roomId);

    if (!room) return null;

    room.status = "live";
    room.startedAt = Date.now();

    return room;
  }

  async endLive(roomId) {
    const room = this.rooms.get(roomId);

    if (!room) return null;

    room.status = "ended";
    room.endedAt = Date.now();

    return room;
  }

  async joinLive(roomId) {
    const room = this.rooms.get(roomId);

    if (!room) return null;

    room.viewers += 1;

    return room.viewers;
  }

  async leaveLive(roomId) {
    const room = this.rooms.get(roomId);

    if (!room) return null;

    room.viewers = Math.max(0, room.viewers - 1);

    return room.viewers;
  }

  async startRecording(roomId) {
    const room = this.rooms.get(roomId);

    if (!room) return;

    room.recording = true;

    return room;
  }

  async stopRecording(roomId) {
    const room = this.rooms.get(roomId);

    if (!room) return;

    room.recording = false;

    return room;
  }

  async createReplay(roomId) {
    const room = this.rooms.get(roomId);

    if (!room) return null;

    room.replay = true;

    return room;
  }

  async createReel(roomId) {
    return {
      roomId,
      type: "reel",
      createdAt: Date.now(),
    };
  }

  async createVideo(roomId) {
    return {
      roomId,
      type: "video",
      createdAt: Date.now(),
    };
  }

  async updateViewers(roomId, viewers) {
    const room = this.rooms.get(roomId);

    if (!room) return;

    room.viewers = viewers;

    return room;
  }

  async updateBandwidth(roomId, bandwidth) {
    const room = this.rooms.get(roomId);

    if (!room) return;

    room.bandwidth = bandwidth;

    return room;
  }

  async updateTimer(roomId, seconds) {
    const room = this.rooms.get(roomId);

    if (!room) return;

    room.timer = seconds;

    return room;
  }

  checkLimits(room, limits) {
    if (!room || !limits) return false;

    if (room.viewers > limits.maxViewers) {
      return false;
    }

    if (room.timer > limits.maxMinutes * 60) {
      return false;
    }

    if (room.bandwidth > limits.maxBandwidthMB) {
      return false;
    }

    return true;
  }

  getRoom(roomId) {
    return this.rooms.get(roomId) ?? null;
  }

  getRooms() {
    return [...this.rooms.values()];
  }

  removeRoom(roomId) {
    return this.rooms.delete(roomId);
  }
}

export default new LiveService();

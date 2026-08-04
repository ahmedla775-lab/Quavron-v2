export const LIVE_LIMITS = {

  FREE: {

    maxConcurrentLives: 10,
    maxViewers: 10,
    maxMinutes: 10,
    maxBandwidthMB: 250,

    recording: true,
    allowReplay: true,
    allowReel: true,
    allowVideo: true,

    defaultQuality: "480p",

    qualities: [
      "480p",
    ],

  },

  PRO: {

    maxConcurrentLives: 100,
    maxViewers: 500,
    maxMinutes: 120,
    maxBandwidthMB: 5000,

    recording: true,
    allowReplay: true,
    allowReel: true,
    allowVideo: true,

    defaultQuality: "1080p",

    qualities: [
      "360p",
      "480p",
      "720p",
      "1080p",
      "1440p",
      "2160p",
      "4320p",
    ],

  },

};

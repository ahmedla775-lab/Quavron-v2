export const LIVE_PRICING = {

  FREE: {
    id: "FREE",
    name: "Free",
    price: 0,
    currency: "USD",

    description: "Free livestream plan",

    limits: "FREE",

    features: [
      "Up to 10 simultaneous live streams",
      "10 viewers per live",
      "10 minutes per live",
      "Recording enabled",
      "Convert recording to Reel",
      "Convert recording to Video",
    ],
  },

  CREATOR: {
    id: "CREATOR",
    name: "Creator",
    price: null,
    currency: "USD",

    description: "For content creators",

    limits: "CREATOR",

    features: [
      "Higher viewer limits",
      "Longer live sessions",
      "Multiple quality options",
      "Priority bandwidth",
    ],
  },

  PRO: {
    id: "PRO",
    name: "Pro",
    price: null,
    currency: "USD",

    description: "Professional livestreaming",

    limits: "PRO",

    features: [
      "Up to 8K quality",
      "Large audience",
      "Extended live duration",
      "Recording",
      "Replay",
      "Analytics",
    ],
  },

  BUSINESS: {
    id: "BUSINESS",
    name: "Business",
    price: null,
    currency: "USD",

    description: "For companies and organizations",

    limits: "BUSINESS",

    features: [
      "Team management",
      "Business analytics",
      "Priority support",
      "Large concurrent live capacity",
    ],
  },

  ENTERPRISE: {
    id: "ENTERPRISE",
    name: "Enterprise",
    price: null,
    currency: "USD",

    description: "Custom enterprise solution",

    limits: "ENTERPRISE",

    features: [
      "Unlimited scalability",
      "Dedicated infrastructure",
      "Custom SLA",
      "Enterprise support",
    ],
  },

};

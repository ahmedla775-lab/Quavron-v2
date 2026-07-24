export const VERIFICATION_TYPES = {

  NONE: null,

  // Official verified account (Facebook / X / Instagram style)
  BLUE: "blue",

  // Government institutions
  GRAY: "gray",

  // Premium / Creator
  BLACK: "black",

  // Business / Organization
  WHITE: "white",

};

export const VERIFICATION_LABELS = {

  [VERIFICATION_TYPES.BLUE]: "Verified",

  [VERIFICATION_TYPES.GRAY]: "Government",

  [VERIFICATION_TYPES.BLACK]: "Premium",

  [VERIFICATION_TYPES.WHITE]: "Business",

};

export const VERIFICATION_COLORS = {

  [VERIFICATION_TYPES.BLUE]: {
    background: "#1D9BF0",
    foreground: "#FFFFFF",
  },

  [VERIFICATION_TYPES.GRAY]: {
    background: "#9CA3AF",
    foreground: "#FFFFFF",
  },

  [VERIFICATION_TYPES.BLACK]: {
    background: "#000000",
    foreground: "#FFFFFF",
  },

  [VERIFICATION_TYPES.WHITE]: {
    background: "#FFFFFF",
    foreground: "#000000",
  },

};

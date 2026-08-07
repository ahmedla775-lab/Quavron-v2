export const ROLE_PERMISSIONS = {
  owner: {
    marketplace: true,
    sellerCenter: true,
    developer: true,
    company: true,
    investor: true,
    creator: true,
    verificationReview: true,
  },

  admin: {
    marketplace: false,
    sellerCenter: false,
    developer: false,
    company: false,
    investor: false,
    creator: false,
    verificationReview: true,
  },


  individual: {
    marketplace: false,
    sellerCenter: false,
    developer: false,
    company: false,
    investor: false,
    creator: false,
  },

  developer: {
    marketplace: true,
    sellerCenter: false,
    developer: true,
    company: false,
    investor: false,
    creator: false,
  },

  programmer: {
    marketplace: true,
    sellerCenter: false,
    developer: true,
    company: false,
    investor: false,
    creator: false,
  },

  designer: {
    marketplace: true,
    sellerCenter: true,
    developer: false,
    company: false,
    investor: false,
    creator: true,
  },

  seller: {
    marketplace: true,
    sellerCenter: true,
    developer: false,
    company: false,
    investor: false,
    creator: false,
  },

  company_owner: {
    marketplace: true,
    sellerCenter: true,
    developer: true,
    company: true,
    investor: false,
    creator: false,
  },

  investor: {
    marketplace: true,
    sellerCenter: false,
    developer: false,
    company: true,
    investor: true,
    creator: false,
  },

  startup: {
    marketplace: true,
    sellerCenter: true,
    developer: true,
    company: true,
    investor: false,
    creator: true,
  },

  freelancer: {
    marketplace: true,
    sellerCenter: true,
    developer: true,
    company: false,
    investor: false,
    creator: true,
  },

  creator: {
    marketplace: true,
    sellerCenter: true,
    developer: false,
    company: false,
    investor: false,
    creator: true,
  },

  teacher: {
    marketplace: true,
    sellerCenter: false,
    developer: false,
    company: false,
    investor: false,
    creator: true,
  },

  researcher: {
    marketplace: true,
    sellerCenter: false,
    developer: true,
    company: false,
    investor: true,
    creator: false,
  },

  organization: {
    marketplace: true,
    sellerCenter: true,
    developer: true,
    company: true,
    investor: false,
    creator: false,
  },

  government: {
    marketplace: false,
    sellerCenter: false,
    developer: false,
    company: true,
    investor: false,
    creator: false,
  },

  quavron_official: {
    marketplace: true,
    sellerCenter: true,
    developer: true,
    company: true,
    investor: true,
    creator: true,
    verificationReview: true,
  }

};

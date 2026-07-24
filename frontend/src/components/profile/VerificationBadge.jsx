import { BadgeCheck, CheckCircle2 } from "lucide-react";

import {
  VERIFICATION_TYPES,
} from "../../constants/verification";

export default function VerificationBadge({

  type = VERIFICATION_TYPES.NONE,

  size = 18,

}) {

  switch (type) {

    // Facebook / X / Instagram
    case VERIFICATION_TYPES.BLUE:

      return (
        <BadgeCheck
          size={size}
          strokeWidth={2}
          className="
            inline
            fill-[#1D9BF0]
            text-white
          "
        />
      );

    // Government
    case VERIFICATION_TYPES.GRAY:

      return (
        <BadgeCheck
          size={size}
          strokeWidth={2}
          className="
            inline
            fill-[#9CA3AF]
            text-white
          "
        />
      );

    // Premium / Creator
    case VERIFICATION_TYPES.BLACK:

      return (
        <BadgeCheck
          size={size}
          strokeWidth={2}
          className="
            inline
            fill-black
            text-white
          "
        />
      );

    // Business
    case VERIFICATION_TYPES.WHITE:

      return (
        <CheckCircle2
          size={size}
          strokeWidth={2.5}
          className="
            inline
            fill-white
            text-black
          "
        />
      );

    default:

      return null;

  }

}

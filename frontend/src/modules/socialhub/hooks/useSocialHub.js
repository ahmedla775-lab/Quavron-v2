import { useContext } from "react";
import { SocialHubContext } from "../providers/SocialHubProvider";

export default function useSocialHub() {
  const context = useContext(SocialHubContext);

  if (!context) {
    throw new Error(
      "useSocialHub must be used within SocialHubProvider"
    );
  }

  return context;
}

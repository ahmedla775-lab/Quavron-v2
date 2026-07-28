import AccountSettings from "./pages/AccountSettings";
import ProfileSettings from "./pages/ProfileSettings";
import SecuritySettings from "./pages/SecuritySettings";
import PrivacySettings from "./pages/PrivacySettings";
import NotificationSettings from "./pages/NotificationSettings";
import AppearanceSettings from "./pages/AppearanceSettings";
import LanguageSettings from "./pages/LanguageSettings";
import VerificationSettings from "./pages/VerificationSettings";
import CommunitySettings from "./pages/CommunitySettings";
import AISettings from "./pages/AISettings";
import IDESettings from "./pages/IDESettings";
import HostingSettings from "./pages/HostingSettings";
import MarketplaceSettings from "./pages/MarketplaceSettings";
import DeveloperSettings from "./pages/DeveloperSettings";
import BillingSettings from "./pages/BillingSettings";
import APISettings from "./pages/APISettings";
import { SETTINGS_SEARCH } from "../../constants/settingsSearch";
export default function SettingsContent({
  selected,
  search,
}) {

  switch (selected) {

    case "account":
      return <AccountSettings />;

    case "profile":
      return <ProfileSettings />;

    case "security":
      return <SecuritySettings />;

    case "privacy":
      return <PrivacySettings />;

    case "notifications":
      return <NotificationSettings />;

    case "appearance":
      return <AppearanceSettings />;

    case "language":
      return <LanguageSettings />;

    case "verification":
      return <VerificationSettings />;

    case "community":
      return <CommunitySettings />;

    case "ai":
      return <AISettings />;

    case "ide":
      return <IDESettings />;

    case "hosting":
      return <HostingSettings />;

    case "marketplace":
      return <MarketplaceSettings />;

    case "developer":
      return <DeveloperSettings />;

    case "billing":
      return <BillingSettings />;

    case "api":
      return <APISettings />;

    default:
      return <AccountSettings />;

  }

}

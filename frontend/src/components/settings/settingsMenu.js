import {
  User,
  Shield,
  Lock,
  Bell,
  Palette,
  Globe,
  Users,
  Bot,
  Code2,
  ShoppingBag,
  Cloud,
  Wrench,
  BadgeCheck,
  CreditCard,
  Database,
} from "lucide-react";

const settingsMenu = [

  {
    group: "Account Center",
    items: [
      { id: "account", title: "Personal details", icon: User },
      { id: "security", title: "Password & Security", icon: Lock },
      { id: "privacy", title: "Privacy", icon: Shield },
      { id: "notifications", title: "Notifications", icon: Bell },
    ],
  },

  {
    group: "Profile",
    items: [
      { id: "profile", title: "Profile", icon: Users },
             { id: "identity", title: "Identity Profile", icon: User },
      { id: "verification", title: "Verification", icon: BadgeCheck },
      { id: "appearance", title: "Appearance", icon: Palette },
      { id: "language", title: "Language", icon: Globe },
    ],
  },

  {
    group: "Quavron",
    items: [
      { id: "community", title: "Community", icon: Users },
      { id: "ai", title: "AI Assistant", icon: Bot },
      { id: "ide", title: "Cloud IDE", icon: Code2 },
      { id: "hosting", title: "Hosting", icon: Cloud },
      { id: "marketplace", title: "Marketplace", icon: ShoppingBag },
    ],
  },

  {
    group: "Developer",
    items: [
      { id: "developer", title: "Developer", icon: Wrench },
      { id: "api", title: "API Keys", icon: Database },
      { id: "billing", title: "Billing", icon: CreditCard },
    ],
  },

];

export default settingsMenu;

import {
  LayoutDashboard,
  Globe,
  FileText,
  Image,
  FolderOpen,
  Briefcase,
  Boxes,
  Users,
  ShieldCheck,
  Bot,
  Settings,
  Activity,
} from "lucide-react";

const navigation = [

  {
    id: "dashboard",
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/control",
  },

  {
    id: "homepage",
    title: "Homepage Builder",
    icon: Globe,
    path: "/control/homepage",
  },

  {
    id: "content",
    title: "Corporate Content",
    icon: FileText,
    path: "/control/content",
  },

  {
    id: "media",
    title: "Media Library",
    icon: Image,
    path: "/control/media",
  },

  {
    id: "documents",
    title: "Documents",
    icon: FolderOpen,
    path: "/control/documents",
  },

  {
    id: "products",
    title: "Products & Services",
    icon: Boxes,
    path: "/control/products",
  },

  {
    id: "projects",
    title: "Projects",
    icon: Briefcase,
    path: "/control/projects",
  },

  {
    id: "users",
    title: "Users",
    icon: Users,
    path: "/control/users",
  },

  {
    id: "security",
    title: "Security",
    icon: ShieldCheck,
    path: "/control/security",
  },

  {
    id: "ai",
    title: "AI Center",
    icon: Bot,
    path: "/control/ai",
  },

  {
    id: "analytics",
    title: "Analytics",
    icon: Activity,
    path: "/control/analytics",
  },

  {
    id: "settings",
    title: "Settings",
    icon: Settings,
    path: "/control/settings",
  },

];

export default navigation;

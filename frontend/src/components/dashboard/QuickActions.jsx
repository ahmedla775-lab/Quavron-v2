import {
  Code2,
  Bot,
  Users,
  Cloud,
  ShoppingBag,
  GraduationCap,
  User,
  BarChart3,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useTheme } from "../../theme/ThemeProvider";

const actions = [
  {
    title: "Cloud IDE",
    icon: Code2,
    path: "/ide",
  },
  {
    title: "AI Assistant",
    icon: Bot,
    path: "/ai",
  },
  {
    title: "Community",
    icon: Users,
    path: "/community",
  },
  {
    title: "Hosting",
    icon: Cloud,
    path: "/hosting",
  },
  {
    title: "Marketplace",
    icon: ShoppingBag,
    path: "/marketplace",
  },
  {
    title: "Courses",
    icon: GraduationCap,
    path: "/courses",
  },
  {
    title: "Profile",
    icon: User,
    path: "/profile",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    path: "/analytics",
  },
];

export default function QuickActions() {

  const navigate = useNavigate();

  const { isDark } = useTheme();

  return (

    <section>

      <div className="mb-5">

        <h2
          className="text-2xl font-bold"
          style={{
            color: isDark ? "#fff" : "#111827",
          }}
        >
          Quick Access
        </h2>

      </div>

      <div
  className="
    grid
    grid-cols-2
    gap-4
    lg:grid-cols-4
  "
>
  {actions.map((item) => {

    const Icon = item.icon;

    return (

      <button
        key={item.path}
        onClick={() => navigate(item.path)}
        className="
          group
          relative
          overflow-hidden
          rounded-3xl
          p-6
          text-left
          transition-all
          duration-300
          hover:-translate-y-2
          hover:scale-[1.02]
          active:scale-95
        "
        style={{
          background: isDark ? "#0f172a" : "#ffffff",
          border: `1px solid ${isDark ? "#1e293b" : "#e5e7eb"}`,
        }}
      >

        <div
          className="
            mb-5
            inline-flex
            rounded-2xl
            p-4
            transition-all
            duration-300
            group-hover:rotate-6
            group-hover:scale-110
          "
          style={{
            background: "#06b6d4",
            color: "#fff",
          }}
        >
          <Icon size={24} />
        </div>

        <h3
          className="
            text-lg
            font-bold
            tracking-tight
          "
          style={{
            color: isDark ? "#fff" : "#111827",
          }}
        >
          {item.title}
        </h3>

      </button>

    );

  })}
</div>

    </section>

  );

}

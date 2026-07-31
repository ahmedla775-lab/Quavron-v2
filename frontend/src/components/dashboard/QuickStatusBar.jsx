import {
  FolderOpen,
  Bot,
  Cloud,
  Users,
} from "lucide-react";

import { useTheme } from "../../theme/ThemeProvider";

export default function QuickStatusBar() {
  const { isDark } = useTheme();

  const items = [
    {
      icon: FolderOpen,
      label: "Projects",
      value: "--",
    },
    {
      icon: Bot,
      label: "AI",
      value: "--",
    },
    {
      icon: Cloud,
      label: "Hosting",
      value: "--",
    },
    {
      icon: Users,
      label: "Community",
      value: "--",
    },
  ];

  return (
    <section
      className="
        flex
        flex-wrap
        items-center
        gap-4
        rounded-2xl
        px-4
        py-3
      "
      style={{
        background: isDark ? "#0f172a" : "#ffffff",
        border: `1px solid ${
          isDark ? "#1e293b" : "#e5e7eb"
        }`,
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="
              flex
              min-w-[170px]
              flex-1
              items-center
              gap-3
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
              "
              style={{
                background: "#06b6d4",
                color: "#ffffff",
              }}
            >
              <Icon size={18} />
            </div>

            <div>
              <p
                className="text-xs"
                style={{
                  color: isDark
                    ? "#94a3b8"
                    : "#64748b",
                }}
              >
                {item.label}
              </p>

              <h3
                className="font-semibold"
                style={{
                  color: isDark
                    ? "#ffffff"
                    : "#0f172a",
                }}
              >
                {item.value}
              </h3>
            </div>
          </div>
        );
      })}
    </section>
  );
}

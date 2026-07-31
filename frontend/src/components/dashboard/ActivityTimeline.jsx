import {
  GitCommit,
  Rocket,
  ShieldCheck,
  Sparkles,
  Bell,
} from "lucide-react";

import { useTheme } from "../../theme/ThemeProvider";

const timeline = [
  {
    title: "Platform initialized",
    description: "Quavron platform is ready.",
    icon: Rocket,
  },
  {
    title: "Security verified",
    description: "System integrity verified successfully.",
    icon: ShieldCheck,
  },
  {
    title: "AI services ready",
    description: "Artificial Intelligence modules are online.",
    icon: Sparkles,
  },
  {
    title: "Latest update",
    description: "New platform improvements are available.",
    icon: Bell,
  },
  {
    title: "Development",
    description: "Repository synchronized successfully.",
    icon: GitCommit,
  },
];

export default function ActivityTimeline() {

  const { isDark } = useTheme();

  return (

    <section>

      <div className="mb-6">

        <h2
          className="text-2xl font-bold"
          style={{
            color: isDark ? "#ffffff" : "#111827",
          }}
        >
          Platform Activity
        </h2>

      </div>

      <div className="space-y-5">

        {timeline.map((item, index) => {

          const Icon = item.icon;

          return (

            <div
              key={index}
              className="flex gap-5"
            >

              <div className="flex flex-col items-center">

                <div
                  className="rounded-full p-3"
                  style={{
                    background: "#06b6d4",
                    color: "#ffffff",
                  }}
                >
                  <Icon size={18} />
                </div>

                {index !== timeline.length - 1 && (

                  <div
                    className="mt-2 h-16 w-px"
                    style={{
                      background: isDark
                        ? "#1e293b"
                        : "#cbd5e1",
                    }}
                  />

                )}

              </div>

              <div
                className="flex-1 rounded-2xl p-5"
                style={{
                  background: isDark
                    ? "#0f172a"
                    : "#ffffff",
                  border: `1px solid ${
                    isDark
                      ? "#1e293b"
                      : "#e5e7eb"
                  }`,
                }}
              >

                <h3
                  className="font-bold"
                  style={{
                    color: isDark
                      ? "#ffffff"
                      : "#111827",
                  }}
                >
                  {item.title}
                </h3>

                <p
                  className="mt-2"
                  style={{
                    color: isDark
                      ? "#94a3b8"
                      : "#64748b",
                  }}
                >
                  {item.description}
                </p>

              </div>

            </div>

          );

        })}

      </div>

    </section>

  );

}

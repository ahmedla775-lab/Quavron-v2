import {
  ArrowRight,
  Code2,
  PlayCircle,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useTheme } from "../../theme/ThemeProvider";

export default function ContinueWorking() {
  const { isDark } = useTheme();

  return (
    <section
      className="rounded-2xl p-6"
      style={{
        background: isDark ? "#0f172a" : "#ffffff",
        border: `1px solid ${
          isDark ? "#1e293b" : "#e5e7eb"
        }`,
      }}
    >
      <div className="flex items-center justify-between">

        <div>

          <h2
            className="text-2xl font-bold"
            style={{
              color: isDark ? "#fff" : "#0f172a",
            }}
          >
            Continue Working
          </h2>

          <p
            className="mt-1 text-sm"
            style={{
              color: isDark ? "#94a3b8" : "#64748b",
            }}
          >
            Resume your latest activity.
          </p>

        </div>

        <Link
          to="/ide"
          className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-cyan-500
            px-4
            py-2
            font-semibold
            text-white
            transition
            hover:bg-cyan-600
          "
        >
          Open
          <ArrowRight size={18}/>
        </Link>

      </div>

      <div className="mt-6 space-y-4">

        <div
          className="flex items-center justify-between rounded-xl p-4"
          style={{
            background: isDark ? "#111827" : "#f8fafc",
          }}
        >

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-cyan-500 p-3 text-white">
              <Code2 size={20}/>
            </div>

            <div>

              <h3
                className="font-semibold"
                style={{
                  color: isDark ? "#fff" : "#111827",
                }}
              >
                Quavron IDE
              </h3>

              <p
                className="text-sm"
                style={{
                  color: isDark ? "#94a3b8" : "#64748b",
                }}
              >
                Last edited project
              </p>

            </div>

          </div>

          <ArrowRight size={20}/>

        </div>

        <div
          className="flex items-center justify-between rounded-xl p-4"
          style={{
            background: isDark ? "#111827" : "#f8fafc",
          }}
        >

          <div className="flex items-center gap-4">

            <div className="rounded-xl bg-cyan-500 p-3 text-white">
              <PlayCircle size={20}/>
            </div>

            <div>

              <h3
                className="font-semibold"
                style={{
                  color: isDark ? "#fff" : "#111827",
                }}
              >
                Live Session
              </h3>

              <p
                className="text-sm"
                style={{
                  color: isDark ? "#94a3b8" : "#64748b",
                }}
              >
                Rejoin your previous live room.
              </p>

            </div>

          </div>

          <ArrowRight size={20}/>

        </div>

      </div>

    </section>
  );
}

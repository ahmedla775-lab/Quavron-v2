import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import { useTheme } from "../../theme/ThemeProvider";

export default function DashboardLayout({ children }) {
  const { isDark } = useTheme();

  return (
    <div
      className={`
        min-h-screen
        overflow-x-hidden
        transition-colors
        duration-300
        ${
          isDark
            ? "bg-slate-950 text-white"
            : "bg-slate-100 text-slate-900"
        }
      `}
    >
      <div
        className="
          flex
          min-h-screen
          min-w-0
        "
      >
        <Sidebar />

        <div
          className="
            flex
            min-w-0
            flex-1
            flex-col
          "
        >
          <Topbar />

          <main
            className="
              flex-1
              min-w-0
              overflow-x-hidden
              overflow-y-auto
            "
          >
            <div
              className="
                mx-auto
                w-full
                max-w-[1700px]
                p-0
                sm:p-4
                lg:p-8
              "
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

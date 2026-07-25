import MobileBottomNav from "../navigation/MobileBottomNav";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import { useTheme } from "../../theme/ThemeProvider";

export default function DashboardLayout({ children }) {
  const { isDark } = useTheme();

  return (
    <div
      className={`
        min-h-screen
        overflow-hidden
        transition-colors
        duration-300
        ${
          isDark
            ? "bg-slate-950 text-white"
            : "bg-slate-100 text-slate-900"
        }
      `}
    >
      <div className="flex min-h-screen">

        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">

          <Topbar />

          <main
            className="
              flex-1
              overflow-x-hidden
              overflow-y-auto
              pb-20
            "
          >
            {children}
          </main>

          <MobileBottomNav />

        </div>

      </div>
    </div>
  );
}

import MobileBottomNav from "../navigation/MobileBottomNav";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children }) {

  return (
    <div
 className="
 min-h-screen
 flex
 flex-col
 overflow-x-hidden
 bg-[var(--q-bg)]
 text-[var(--q-text)]
 "
>
      <Sidebar />

      <div
        className="
          flex-1
          min-w-0
          flex
          flex-col
        "
      >

        <Topbar />

        <main
 className="
 flex-1
 min-h-0
 w-full
 overflow-y-auto
 pb-20
 "
>
  {children}
</main>
        <MobileBottomNav />

      </div>

    </div>
  );
}

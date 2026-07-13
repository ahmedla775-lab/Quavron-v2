import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <div className="flex">

        <Sidebar />

        <div className="flex flex-1 flex-col">

          <Topbar />

          <main className="flex-1 overflow-y-auto p-8">

            {children}

          </main>

        </div>

      </div>

    </div>
  );
}


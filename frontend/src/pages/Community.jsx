import DashboardLayout from "../components/dashboard/DashboardLayout";

import Sidebar from "../components/community/Sidebar";
import Feed from "../components/community/Feed";
import RightSidebar from "../components/community/RightSidebar";
import TrendingBar from "../components/community/TrendingBar";

export default function Community() {

  return (

    <DashboardLayout>

      <div className="flex h-full bg-slate-950 text-white">

        <aside className="w-72 border-r border-slate-800">

          <Sidebar />

        </aside>

        <main className="flex flex-1 flex-col border-r border-slate-800">

          <TrendingBar />

          <div className="flex-1 overflow-hidden">

            <Feed />

          </div>

        </main>

        <aside className="w-80 border-l border-slate-800">

          <RightSidebar />

        </aside>

      </div>

    </DashboardLayout>

  );

}

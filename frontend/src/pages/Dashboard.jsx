import DashboardLayout from "../components/dashboard/DashboardLayout";
import StatsCards from "../components/dashboard/StatsCards";
import RecentProjects from "../components/dashboard/RecentProjects";
import AIWidget from "../components/dashboard/AIWidget";
import Activity from "../components/dashboard/Activity";

export default function Dashboard() {
  return (
    <DashboardLayout>

      <div className="space-y-8">

        <StatsCards />

        <div className="grid gap-8 xl:grid-cols-2">

          <RecentProjects />

          <AIWidget />

        </div>

        <Activity />

      </div>

    </DashboardLayout>
  );
}


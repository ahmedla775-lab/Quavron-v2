import DashboardLayout from "../components/dashboard/DashboardLayout";
import StatsCards from "../components/dashboard/StatsCards";
import RecentProjects from "../components/dashboard/RecentProjects";
import AIWidget from "../components/dashboard/AIWidget";
import Activity from "../components/dashboard/Activity";

export default function Dashboard() {
  return (
    <DashboardLayout>

      <div
        className="
          mx-auto
          w-full
          max-w-[1700px]

          px-3
          py-3

          sm:px-4
          sm:py-4

          lg:px-8
          lg:py-8

          space-y-5
          sm:space-y-6
          lg:space-y-8
        "
      >

        <StatsCards />

        <div
          className="
            grid
            gap-5
            lg:gap-8
            xl:grid-cols-2
          "
        >

          <RecentProjects />

          <AIWidget />

        </div>

        <Activity />

      </div>

    </DashboardLayout>
  );
}

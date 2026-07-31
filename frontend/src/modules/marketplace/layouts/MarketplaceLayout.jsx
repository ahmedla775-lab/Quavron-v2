import DashboardLayout from "../../../components/dashboard/DashboardLayout";

export default function MarketplaceLayout({ children }) {
  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-[1700px] px-4 py-6 lg:px-8">
        {children}
      </div>
    </DashboardLayout>
  );
}

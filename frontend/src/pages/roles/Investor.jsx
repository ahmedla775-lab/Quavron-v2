export default function Investor(){

  return (
    <div className="mx-auto max-w-5xl p-8">
      <h1 className="text-3xl font-bold text-[var(--q-text)]">
        Investor Center
      </h1>

      <p className="mt-3 text-[var(--q-muted)]">
        Discover startups, projects and opportunities on Quavron.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-[var(--q-card)] p-6">
          Startups
        </div>

        <div className="rounded-2xl bg-[var(--q-card)] p-6">
          Projects
        </div>

        <div className="rounded-2xl bg-[var(--q-card)] p-6">
          Analytics
        </div>
      </div>
    </div>
  );
}

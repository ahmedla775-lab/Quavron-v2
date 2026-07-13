import DashboardLayout from "../components/dashboard/DashboardLayout";

export default function Profile() {
  return (
    <DashboardLayout>

      <div className="bg-slate-950 text-white">

        <div className="h-56 w-full bg-gradient-to-r from-blue-700 via-cyan-600 to-indigo-700" />

        <div className="mx-auto max-w-6xl px-8">

          <div className="-mt-20 flex items-end gap-6">

            <div className="flex h-40 w-40 items-center justify-center rounded-full border-4 border-slate-950 bg-slate-800 text-5xl font-bold">
              Q
            </div>

            <div className="pb-5">

              <h1 className="text-4xl font-bold">
                Quavron User
              </h1>

              <p className="text-slate-400">
                @quavron
              </p>

            </div>

          </div>

          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h2 className="mb-4 text-2xl font-bold">
              About
            </h2>

            <p className="text-slate-300">
              Welcome to Quavron Community.
            </p>

          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-4">

            <div className="rounded-xl bg-slate-900 p-5">

              <h3 className="text-slate-400">
                Followers
              </h3>

              <div className="mt-2 text-3xl font-bold">
                0
              </div>

            </div>

            <div className="rounded-xl bg-slate-900 p-5">

              <h3 className="text-slate-400">
                Following
              </h3>

              <div className="mt-2 text-3xl font-bold">
                0
              </div>

            </div>

            <div className="rounded-xl bg-slate-900 p-5">

              <h3 className="text-slate-400">
                Posts
              </h3>

              <div className="mt-2 text-3xl font-bold">
                0
              </div>

            </div>

            <div className="rounded-xl bg-slate-900 p-5">

              <h3 className="text-slate-400">
                Projects
              </h3>

              <div className="mt-2 text-3xl font-bold">
                0
              </div>

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>
  );
}

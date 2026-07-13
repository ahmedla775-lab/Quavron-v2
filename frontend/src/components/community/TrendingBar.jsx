const trending = [
  {
    title: "🔥 AI Agents",
    category: "Artificial Intelligence",
  },
  {
    title: "🚀 Open Source",
    category: "Projects",
  },
  {
    title: "📱 Flutter 4",
    category: "Mobile Development",
  },
  {
    title: "⚛ React 20",
    category: "Frontend",
  },
  {
    title: "🦀 Rust",
    category: "Programming",
  },
  {
    title: "☁ Cloud Computing",
    category: "Infrastructure",
  },
];

export default function TrendingBar() {
  return (
    <div className="border-b border-slate-800 bg-slate-900">

      <div className="px-4 py-3">

        <h2 className="mb-3 text-lg font-bold text-white">
          🔥 Trending Now
        </h2>

        <div className="flex gap-3 overflow-x-auto pb-2">

          {trending.map((item) => (

            <button
              key={item.title}
              className="min-w-[220px] rounded-2xl border border-slate-700 bg-slate-800 p-4 text-left transition hover:border-blue-500 hover:bg-slate-700"
            >

              <h3 className="font-semibold text-white">
                {item.title}
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                {item.category}
              </p>

            </button>

          ))}

        </div>

      </div>

    </div>
  );
}

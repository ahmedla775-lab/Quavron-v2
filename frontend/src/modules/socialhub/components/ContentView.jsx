import FacebookRenderer from "./renderers/FacebookRenderer";
import YouTubeRenderer from "./renderers/YouTubeRenderer";
export default function ContentView({ item }) {
  if (!item) {
    return (
      <div className="flex h-full items-center justify-center text-slate-500">
        Select any content to start viewing.
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="border-b border-slate-800 p-6">
        <span className="rounded bg-slate-800 px-2 py-1 text-xs text-slate-300">
          {item.source}
        </span>

        <h1 className="mt-4 text-3xl font-bold text-white">
          {item.title}
        </h1>

        <p className="mt-2 text-slate-400">
          {item.content}
        </p>
      </div>

      <div className="p-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
          {item.source === "youtube" ? (
  <YouTubeRenderer item={item} />
) : item.source === "facebook" ? (
  <FacebookRenderer item={item} />
) : (
  <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
    Renderer coming soon...
  </div>
)}
        </div>
      </div>
    </div>
  );
}

export default function SocialCard({ item }) {
  return (
    <article
      className="
        overflow-hidden
        rounded-xl
        border
        border-slate-800
        bg-slate-900
      "
    >
      {item.thumbnail && (
        <img
          src={item.thumbnail}
          alt={item.title}
          className="h-56 w-full object-cover"
        />
      )}

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span
            className="
              rounded-full
              bg-slate-800
              px-3
              py-1
              text-xs
              text-slate-300
            "
          >
            {item.source}
          </span>

          <span className="text-xs text-slate-500">
            {item.type}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-white">
          {item.title}
        </h3>

        <p className="text-sm text-slate-400">
          {item.content}
        </p>

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-slate-500">
            {item.author}
          </span>


<button
  type="button"
  className="
    rounded-lg
    bg-blue-600
    px-4
    py-2
    text-sm
    text-white
  "
>
  View
</button>
        </div>
      </div>
    </article>
  );
}

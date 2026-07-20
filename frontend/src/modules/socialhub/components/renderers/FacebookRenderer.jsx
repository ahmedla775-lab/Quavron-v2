export default function FacebookRenderer({ item }) {
  if (!item) return null;

  return (
    <div className="space-y-6">

      {item.thumbnail && (
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full rounded-xl"
        />
      )}

      <div>
        <h2 className="text-2xl font-bold text-white">
          {item.title}
        </h2>

        <p className="mt-4 text-slate-400">
          {item.content}
        </p>

        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block text-blue-400"
          >
            Open Facebook
          </a>
        )}
      </div>

    </div>
  );
}

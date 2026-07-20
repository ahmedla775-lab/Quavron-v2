export default function YouTubeRenderer({ item }) {
  if (!item) return null;

  const videoId = item.externalId;

  return (
    <div className="space-y-6">

      <div className="aspect-video overflow-hidden rounded-xl border border-slate-800">

        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={item.title}
          allow="
            accelerometer;
            autoplay;
            clipboard-write;
            encrypted-media;
            gyroscope;
            picture-in-picture;
            web-share
          "
          allowFullScreen
        />

      </div>

      <div>

        <h2 className="text-2xl font-bold text-white">
          {item.title}
        </h2>

        <p className="mt-4 text-slate-400">
          {item.content}
        </p>

      </div>

    </div>
  );
}

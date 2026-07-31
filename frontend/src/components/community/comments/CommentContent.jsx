export default function CommentContent({
  comment,
}) {
  return (
    <div className="mt-3">
      {comment.content && (
        <p
          className="
            whitespace-pre-wrap
            break-words
            leading-7
            text-[var(--q-text)]
          "
        >
          {comment.content}
        </p>
      )}

      {comment.media?.length > 0 && (
        <div className="mt-4 space-y-3">
          {comment.media.map((item) => (
            <div
              key={item.id}
              className="
                overflow-hidden
                rounded-2xl
                border
                border-[var(--q-border)]
                bg-[var(--q-card)]
              "
            >
              {item.mime_type?.startsWith("image/") && (
                <img
                  src={item.url}
                  alt={item.file_name}
                  loading="lazy"
                  className="
                    block
                    w-full
                    object-cover
                    max-h-[500px]
                  "
                />
              )}

              {item.mime_type?.startsWith("video/") && (
                <video
                  controls
                  preload="metadata"
                  className="
                    block
                    w-full
                    max-h-[500px]
                  "
                >
                  <source
                    src={item.url}
                    type={item.mime_type}
                  />
                </video>
              )}

              {item.mime_type?.startsWith("audio/") && (
                <div className="p-4">
                  <audio
                    controls
                    className="w-full"
                  >
                    <source
                      src={item.url}
                      type={item.mime_type}
                    />
                  </audio>
                </div>
              )}

              {!item.mime_type?.startsWith("image/") &&
                !item.mime_type?.startsWith("video/") &&
                !item.mime_type?.startsWith("audio/") && (
                  <div className="p-4">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="
                        break-all
                        text-[var(--q-primary)]
                        hover:underline
                      "
                    >
                      📄 {item.file_name}
                    </a>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

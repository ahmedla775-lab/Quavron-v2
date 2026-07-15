export default function PostContent({ post }) {

  const media = post.post_media || [];

  return (

    <div className="mt-4">

      {post.content && (

        <p className="whitespace-pre-wrap leading-7 text-slate-200">

          {post.content}

        </p>

      )}

      {media.length > 0 && (

        <div className="mt-4 space-y-4">

          {media.map((item) => (

            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border border-slate-800"
            >

              {item.mime_type?.startsWith("image/") && (

                <img
                  src={item.url}
                  alt={item.file_name}
                  className="w-full object-cover"
                />

              )}

              {item.mime_type?.startsWith("video/") && (

                <video
                  controls
                  className="w-full"
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

              {!item.mime_type?.startsWith("image/")
                && !item.mime_type?.startsWith("video/")
                && !item.mime_type?.startsWith("audio/") && (

                <div className="p-4">

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-blue-400 hover:underline"
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

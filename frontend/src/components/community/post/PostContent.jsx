export default function PostContent({ post }) {

  return (

    <div className="mt-4">

      {post.content && (

        <p className="whitespace-pre-wrap text-slate-200 leading-7">

          {post.content}

        </p>

      )}

      {post.media_url && (

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800">

          {post.media_type === "image" ? (

            <img
              src={post.media_url}
              alt="Post"
              className="w-full object-cover"
            />

          ) : post.media_type === "video" ? (

            <video
              controls
              className="w-full"
            >

              <source
                src={post.media_url}
              />

            </video>

          ) : null}

        </div>

      )}

    </div>

  );

}

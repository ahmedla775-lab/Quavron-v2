export default function PostHeader({ post }) {

  return (

    <div className="flex items-center gap-3">

      {post.avatar_url ? (

        <img
          src={post.avatar_url}
          alt={post.full_name}
          className="h-11 w-11 rounded-full object-cover"
        />

      ) : (

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-bold text-white">

          {(post.username || "Q")
            .charAt(0)
            .toUpperCase()}

        </div>

      )}

      <div className="flex-1">

        <h3 className="font-semibold text-white">

          {post.full_name || "Quavron User"}

        </h3>

        <p className="text-sm text-slate-400">

          @{post.username || "user"}

        </p>

        <p className="text-xs text-slate-500">

          {new Date(post.created_at)
            .toLocaleString()}

        </p>

      </div>

    </div>

  );

}

import { useMemo } from "react";
import { usePosts } from "../../../context/PostContext";
import PostCard from "../PostCard";

export default function Videos() {
  const { posts } = usePosts();

  const videos = useMemo(() => {
    return posts.filter((post) => {
      const type = (post.type || "").toLowerCase();
      const platform = (post.platform || "").toLowerCase();

      return (
        type === "video" ||
        platform.includes("youtube") ||
        platform.includes("video")
      );
    });
  }, [posts]);

  return (
    <div className="h-full overflow-y-auto bg-slate-950 p-4">
      <h2 className="mb-4 text-2xl font-bold text-white">
        Videos
      </h2>

      {videos.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
          <p className="text-slate-400">
            No videos available yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {videos.map((post) => (
            <PostCard
              key={post.id}
              post={post}
            />
          ))}
        </div>
      )}
    </div>
  );
}

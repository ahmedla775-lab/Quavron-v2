import { useMemo } from "react";
import { usePosts } from "../../../context/PostContext";
import PostCard from "../PostCard";

export default function Reels() {
  const { posts } = usePosts();

  const reels = useMemo(() => {
    return posts.filter((post) => {
      const platform = (post.platform || "").toLowerCase();
      const type = (post.type || "").toLowerCase();

      return (
        platform.includes("reel") ||
        type === "reel" ||
        type === "short"
      );
    });
  }, [posts]);

  return (
    <div className="h-full overflow-y-auto bg-slate-950 p-4">
      <h2 className="mb-4 text-2xl font-bold text-white">
        Reels
      </h2>

      {reels.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
          <p className="text-slate-400">
            No reels available yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reels.map((post) => (
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

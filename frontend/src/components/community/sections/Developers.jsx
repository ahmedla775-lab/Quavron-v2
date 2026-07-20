import { useMemo } from "react";
import { usePosts } from "../../../context/PostContext";
import PostCard from "../PostCard";

export default function Developers() {
  const { posts } = usePosts();

  const developerPosts = useMemo(() => {
    return posts.filter((post) => {
      const text = (
        (post.content || "") +
        " " +
        (post.platform || "") +
        " " +
        (post.type || "")
      ).toLowerCase();

      return (
        text.includes("code") ||
        text.includes("programming") ||
        text.includes("javascript") ||
        text.includes("react") ||
        text.includes("python") ||
        text.includes("cpp") ||
        text.includes("java") ||
        text.includes("css") ||
        text.includes("html") ||
        text.includes("git")
      );
    });
  }, [posts]);

  return (
    <div className="h-full overflow-y-auto bg-slate-950 p-4">
      <h2 className="mb-2 text-2xl font-bold text-white">
        Developers
      </h2>

      <p className="mb-6 text-slate-400">
        Programming discussions and development content.
      </p>

      {developerPosts.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
          <p className="text-slate-400">
            No developer posts yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {developerPosts.map((post) => (
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

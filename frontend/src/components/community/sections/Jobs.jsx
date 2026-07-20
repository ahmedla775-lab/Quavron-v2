import { useMemo } from "react";
import { usePosts } from "../../../context/PostContext";
import PostCard from "../PostCard";

export default function Jobs() {
  const { posts } = usePosts();

  const jobs = useMemo(() => {
    return posts.filter((post) => {
      const text = (
        (post.content || "") +
        " " +
        (post.platform || "") +
        " " +
        (post.type || "")
      ).toLowerCase();

      return (
        text.includes("job") ||
        text.includes("hiring") ||
        text.includes("vacancy") ||
        text.includes("career") ||
        text.includes("remote") ||
        text.includes("work") ||
        text.includes("intern")
      );
    });
  }, [posts]);

  return (
    <div className="h-full overflow-y-auto bg-slate-950 p-4">
      <h2 className="mb-2 text-2xl font-bold text-white">
        Jobs
      </h2>

      <p className="mb-6 text-slate-400">
        Find job opportunities shared by the community.
      </p>

      {jobs.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
          <p className="text-slate-400">
            No job posts available yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((post) => (
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

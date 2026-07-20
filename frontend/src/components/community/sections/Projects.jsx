import { useMemo } from "react";
import { usePosts } from "../../../context/PostContext";
import PostCard from "../PostCard";

export default function Projects() {
  const { posts } = usePosts();

  const projectPosts = useMemo(() => {
    return posts.filter((post) => {
      const text = (
        (post.content || "") +
        " " +
        (post.platform || "") +
        " " +
        (post.type || "")
      ).toLowerCase();

      return (
        text.includes("project") ||
        text.includes("github") ||
        text.includes("repository") ||
        text.includes("repo") ||
        text.includes("app") ||
        text.includes("website") ||
        text.includes("platform")
      );
    });
  }, [posts]);

  return (
    <div className="h-full overflow-y-auto bg-slate-950 p-4">
      <h2 className="mb-2 text-2xl font-bold text-white">
        Projects
      </h2>

      <p className="mb-6 text-slate-400">
        Discover software projects shared by the community.
      </p>

      {projectPosts.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
          <p className="text-slate-400">
            No projects available yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {projectPosts.map((post) => (
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

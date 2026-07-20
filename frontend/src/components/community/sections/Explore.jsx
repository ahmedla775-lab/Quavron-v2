import { useMemo, useState } from "react";
import { usePosts } from "../../../context/PostContext";
import PostCard from "../PostCard";

export default function Explore() {
  const { posts } = usePosts();
  const [search, setSearch] = useState("");

  const filteredPosts = useMemo(() => {
    if (!search.trim()) return posts;

    const q = search.toLowerCase();

    return posts.filter((post) => {
      return (
        post.content?.toLowerCase().includes(q) ||
        post.title?.toLowerCase().includes(q) ||
        post.platform?.toLowerCase().includes(q)
      );
    });
  }, [posts, search]);

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-slate-950">
      <div className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950 p-4">
        <h2 className="mb-4 text-2xl font-bold text-white">
          Explore
        </h2>

        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none"
        />
      </div>

      <div className="space-y-4 p-4">
        {filteredPosts.length === 0 ? (
          <p className="text-slate-400">
            No posts found.
          </p>
        ) : (
          filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
            />
          ))
        )}
      </div>
    </div>
  );
}

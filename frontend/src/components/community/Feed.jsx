import { useEffect, useState } from "react";

import { usePosts } from "../../context/PostContext";

import PlatformTabs from "./PlatformTabs";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";

export default function Feed() {

  const [platform, setPlatform] = useState("All");

  const {
    posts,
    loading,
    loadPosts,
  } = usePosts();

  useEffect(() => {

    loadPosts();

  }, []);

  return (

    <div className="h-full overflow-y-auto bg-slate-950">

      <CreatePost />

      <PlatformTabs
        selected={platform}
        onSelect={setPlatform}
      />

      <p className="px-4 py-2 text-sm text-slate-400">

        {loading
          ? "Loading posts..."
          : `${posts.length} Posts`}

      </p>

      <div className="space-y-4 p-4">

        {posts.map((post) => (

          <PostCard
            key={post.id}
            post={post}
          />

        ))}

      </div>

    </div>

  );

}

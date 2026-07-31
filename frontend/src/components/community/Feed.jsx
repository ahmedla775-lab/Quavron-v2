import { useEffect, useState } from "react";

import { usePosts } from "../../context/PostContext";

import PlatformTabs from "./PlatformTabs";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";
import SocialActivityFeed from "./activity/SocialActivityFeed";

import useResponsive from "../../hooks/useResponsive";

export default function Feed() {
  const [platform, setPlatform] = useState("All");

  const { isMobile } = useResponsive();

  const {
    posts,
    loading,
    loadPosts,
  } = usePosts();

  useEffect(() => {
    loadPosts();
  }, []);

  const isQuavronFeed = platform === "All";

  return (
    <div
      className="
        flex
        h-full
        min-w-0
        flex-col
        bg-[var(--q-bg)]
        text-[var(--q-text)]
      "
    >
      <PlatformTabs
        selected={platform}
        onSelect={setPlatform}
      />

      {isQuavronFeed ? (
        <>
          <CreatePost />

          <div
            className="
              px-4
              py-3
              text-sm
              text-[var(--q-muted)]
            "
          >
            {loading
              ? "Loading..."
              : `Today • ${posts.length} Posts`}
          </div>

          <div
            className={`
              flex
              flex-col
              ${
                isMobile
                  ? ""
                  : ""
              }
            `}
          >
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
              />
            ))}
          </div>
        </>
      ) : (
        <SocialActivityFeed
          platform={platform}
        />
      )}
    </div>
  );
}

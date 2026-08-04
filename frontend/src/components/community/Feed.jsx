import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Radio } from "lucide-react";

import { usePosts } from "../../context/PostContext";

import PlatformTabs from "./PlatformTabs";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";
import SocialActivityFeed from "./activity/SocialActivityFeed";
import Reels from "./sections/Reels";
import Videos from "./sections/Videos";
import { Navigate } from "react-router-dom";

// import LiveService from "../../modules/live/services/LiveService";

import useResponsive from "../../hooks/useResponsive";

export default function Feed() {
  const navigate = useNavigate();

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
const isVideos = platform === "Videos";
const isReels = platform === "Reels";
const isLive = platform === "Live";
const isGithub = platform === "GitHub";
const isRLC = platform === "RLC";

const filteredPosts = posts.filter((post) => {

  const hasVideo =
    post.post_media?.some(
      (media) => media.mime_type?.startsWith("video/")
    );

  if (isVideos) {
    return post.type === "video" || hasVideo;
  }

  if (isReels) {
    return (
      post.type === "reel" ||
      post.is_reel === true
    );
  }

  if (isLive) {
    return post.type === "live";
  }

  return true;
});

  return (
    <div className="flex h-full min-w-0 flex-col bg-[var(--q-bg)] text-[var(--q-text)]">

      <PlatformTabs
        selected={platform}
        onSelect={setPlatform}
      />

      {(isQuavronFeed || isVideos || isReels || isLive) ? (
        <>
          <CreatePost />


          <div className="px-4 py-3 text-sm text-[var(--q-muted)]">
            {loading
              ? "Loading..."
              : `Today • ${filteredPosts.length} Posts`}
          </div>

          <div className="flex flex-col">
            {filteredPosts.map((post) => (
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

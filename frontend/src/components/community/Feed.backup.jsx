import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Radio } from "lucide-react";

import { usePosts } from "../../context/PostContext";

import PlatformTabs from "./PlatformTabs";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";
import SocialActivityFeed from "./activity/SocialActivityFeed";

import LiveService from "../../modules/live/services/LiveService";

import useResponsive from "../../hooks/useResponsive";

export default function Feed() {
  const navigate = useNavigate();

  const [platform, setPlatform] = useState("All");
  const [liveRooms, setLiveRooms] = useState([]);

  const { isMobile } = useResponsive();

  const {
    posts,
    loading,
    loadPosts,
  } = usePosts();

  useEffect(() => {
    loadPosts();

    const id = setInterval(() => {
      setLiveRooms(
        LiveService
          .getRooms()
          .filter((room) => room.status === "live")
      );
    }, 1000);

    return () => clearInterval(id);
  }, []);

  const isQuavronFeed = platform === "All";

  return (
    <div className="flex h-full min-w-0 flex-col bg-[var(--q-bg)] text-[var(--q-text)]">

      <PlatformTabs
        selected={platform}
        onSelect={setPlatform}
      />

      {isQuavronFeed ? (
        <>
          <CreatePost />

          {liveRooms.length > 0 && (
            <div className="space-y-3 border-b border-[var(--q-border)] p-4">

              {liveRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() =>
                    navigate(
                      "/community/watch/" + room.id
                    )
                  }
                  className="flex w-full items-center justify-between rounded-2xl bg-red-600 p-4 text-left text-white"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Radio size={18} />
                      LIVE
                    </div>

                    <p className="mt-1 text-sm">
                      {room.title}
                    </p>
                  </div>

                  <div className="text-right text-sm">
                    👁 {room.viewers}
                  </div>
                </button>
              ))}

            </div>
          )}

          <div className="px-4 py-3 text-sm text-[var(--q-muted)]">
            {loading
              ? "Loading..."
              : `Today • ${posts.length} Posts`}
          </div>

          <div className="flex flex-col">
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

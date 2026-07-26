import { useState, useEffect } from "react";

import FollowersModal from "./follow/FollowersModal";
import FollowingModal from "./follow/FollowingModal";

import ProfileService from "../../services/ProfileService";

export default function ProfileStats({ profile }) {
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    if (!profile?.id) return;

    async function load() {
      const followersResult =
        await ProfileService.getFollowers(profile.id);

      const followingResult =
        await ProfileService.getFollowing(profile.id);

      setFollowers(followersResult.data || []);
      setFollowing(followingResult.data || []);
    }

    load();
  }, [profile?.id]);

  const stats = [
    {
      title: "Posts",
      value: profile?.posts_count || 0,
    },
    {
      title: "Followers",
      value: followers.length,
      action: () => setFollowersOpen(true),
    },
    {
      title: "Following",
      value: following.length,
      action: () => setFollowingOpen(true),
    },
    {
      title: "Projects",
      value: profile?.projects_count || 0,
    },
    {
      title: "Level",
      value: profile?.level || 1,
    },
    {
      title: "Reputation",
      value: profile?.reputation || 0,
    },
  ];

  return (
    <>
      <div className="mt-5 border-y border-slate-800">
        <div className="grid grid-cols-3">
          {stats.map((item) => (
            <button
              key={item.title}
              onClick={item.action}
              disabled={!item.action}
              className="
                flex
                flex-col
                items-center
                justify-center
                py-4
                transition
                hover:bg-slate-900/40
                disabled:cursor-default
              "
            >
              <span className="text-2xl font-bold text-white">
                {item.value}
              </span>

              <span className="mt-1 text-xs text-slate-400">
                {item.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      <FollowersModal
        open={followersOpen}
        users={followers}
        onClose={() => setFollowersOpen(false)}
      />

      <FollowingModal
        open={followingOpen}
        users={following}
        onClose={() => setFollowingOpen(false)}
      />
    </>
  );
}

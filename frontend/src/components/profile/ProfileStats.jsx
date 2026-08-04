import { useState } from "react";

import FollowersModal from "./follow/FollowersModal";
import FollowingModal from "./follow/FollowingModal";



export default function ProfileStats({ profile }) {
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);

  const followers = profile?.followers || [];
  const following = profile?.following || [];

  const stats = [
    {
      title: "Posts",
      value: profile?.posts_count || 0,
    },
    {
      title: "Followers",
      value: profile?.followers_count || 0,
      action: () => setFollowersOpen(true),
    },
    {
      title: "Following",
      value: profile?.following_count || 0,
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
      <div className="mt-5 border-y border-[var(--q-border)]">
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
                hover:bg-[var(--q-card)]
                disabled:cursor-default
              "
            >
              <span className="text-2xl font-bold text-[var(--q-text)]">
                {item.value}
              </span>

              <span className="mt-1 text-xs text-[var(--q-muted)]">
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

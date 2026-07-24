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
      title: "Posts",
      value: profile?.posts_count || 0,
    },

    {
      title: "Reputation",
      value: profile?.reputation || 0,
    },

    {
      title: "Level",
      value: profile?.level || 1,
    },

  ];

  return (

    <>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">

        {stats.map((item) => (

          <button
            key={item.title}
            onClick={item.action}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-5 text-center transition hover:border-blue-500"
          >

            <p className="text-3xl font-bold text-white">

              {item.value}

            </p>

            <p className="mt-2 text-sm text-slate-400">

              {item.title}

            </p>

          </button>

        ))}

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

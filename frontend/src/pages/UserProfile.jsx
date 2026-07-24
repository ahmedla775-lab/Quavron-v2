import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileStats from "../components/profile/ProfileStats";
import ProfileTabs from "../components/profile/ProfileTabs";
import ProfilePosts from "../components/profile/ProfilePosts";
import ProfileAbout from "../components/profile/ProfileAbout";
import ProfileMedia from "../components/profile/ProfileMedia";
import ProfileProjects from "../components/profile/ProfileProjects";
import ProfileReels from "../components/profile/ProfileReels";
import ProfileStories from "../components/profile/ProfileStories";
import ProfileActivity from "../components/profile/ProfileActivity";
import ProfileSaved from "../components/profile/ProfileSaved";

import ProfileService from "../services/ProfileService";
import FollowService from "../services/FollowService";
import { useAuth } from "../components/auth/AuthProvider";

export default function UserProfile() {

  const { id } = useParams();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState("Posts");

  const [following, setFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);

  useEffect(() => {

    async function load() {

      const { data } =
        await ProfileService.getProfile(id);

      if (!data) return;

      const followers =
        await ProfileService.getFollowers(id);

      const followingResult =
        await ProfileService.getFollowing(id);

      setProfile({
        ...data,
        followers_count:
          followers.data?.length || 0,
        following_count:
          followingResult.data?.length || 0,
      });

      if (user) {

        const status =
          await FollowService.status(
            user.id,
            data.id
          );

        setFollowing(
          status.following || false
        );

      }

    }

    load();

  }, [id, user]);

  async function toggleFollow() {

    if (!user || !profile) return;

    setLoadingFollow(true);

    try {

      if (following) {

        await FollowService.unfollow(
          user.id,
          profile.id
        );

        setFollowing(false);

        setProfile((current) => ({
          ...current,
          followers_count: Math.max(
            0,
            (current.followers_count || 0) - 1
          ),
        }));

      } else {

        await FollowService.follow(
          user.id,
          profile.id
        );

        setFollowing(true);

        setProfile((current) => ({
          ...current,
          followers_count:
            (current.followers_count || 0) + 1,
        }));

      }

    } catch (error) {

      console.error(error);

    } finally {

      setLoadingFollow(false);

    }

  }

  if (!profile) {

    return (

      <DashboardLayout>

        <div className="p-8 text-white">

          Loading...

        </div>

      </DashboardLayout>

    );

  }

  return (

    <DashboardLayout>

      <div className="mx-auto w-full max-w-7xl px-4 py-6">

        <ProfileHeader
          profile={profile}
          following={following}
          loadingFollow={loadingFollow}
          onFollow={toggleFollow}
        />

        <ProfileStats
          profile={profile}
        />

        <ProfileTabs
          activeTab={tab}
          onChange={setTab}
        />

        {tab === "Posts" && (
          <ProfilePosts profile={profile} />
        )}

        {tab === "Media" && (
          <ProfileMedia profile={profile} />
        )}

        {tab === "Projects" && (
          <ProfileProjects profile={profile} />
        )}

        {tab === "Reels" && (
          <ProfileReels />
        )}

        {tab === "Stories" && (
          <ProfileStories />
        )}

        {tab === "Activity" && (
          <ProfileActivity />
        )}

        {tab === "About" && (
          <ProfileAbout profile={profile} />
        )}

        {tab === "Saved" && (
          <ProfileSaved profile={profile} />
        )}

      </div>

    </DashboardLayout>

  );

}

import { useEffect, useState } from "react";

import DashboardLayout from "../components/dashboard/DashboardLayout";

import { useProfile } from "../context/ProfileContext";

import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileStats from "../components/profile/ProfileStats";
import ProfileTabs from "../components/profile/ProfileTabs";
import ProfileContent from "../components/profile/ProfileContent";
import EditProfileDialog from "../components/profile/EditProfileDialog";

import PostService from "../services/PostService";

export default function Profile() {

  const {

  profile,

  updateAvatar,

  updateCover,

} = useProfile();

  const [tab, setTab] = useState("Posts");

  const [postsCount, setPostsCount] = useState(0);

  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {

    async function loadCount() {

      if (!profile?.id) return;

      const { data } =
        await PostService.getUserPosts(
          profile.id
        );

      setPostsCount(
        data?.length || 0
      );

    }

    loadCount();

  }, [profile]);

  return (

    <DashboardLayout>

      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        <ProfileHeader
  profile={profile}
  onEdit={() => setOpenEdit(true)}
  onAvatarChange={updateAvatar}
  onCoverChange={updateCover}
/>

        <ProfileStats
          profile={{
            ...profile,
            posts_count: postsCount,
          }}
        />

        <ProfileTabs
          activeTab={tab}
          onChange={setTab}
        />

        <ProfileContent
          tab={tab}
          profile={profile}
        />

        <EditProfileDialog
          open={openEdit}
          profile={profile}
          onClose={() => setOpenEdit(false)}
        />

      </div>

    </DashboardLayout>

  );

}

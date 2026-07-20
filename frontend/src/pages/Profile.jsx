import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import PostService from "../services/PostService";
import { useProfile } from "../context/ProfileContext";
import ProfileProjects from "../components/profile/ProfileProjects";
import ProfileReels from "../components/profile/ProfileReels";
import ProfileStories from "../components/profile/ProfileStories";
import ProfileActivity from "../components/profile/ProfileActivity";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileStats from "../components/profile/ProfileStats";
import ProfileTabs from "../components/profile/ProfileTabs";
import ProfilePosts from "../components/profile/ProfilePosts";
import ProfileAbout from "../components/profile/ProfileAbout";
import ProfileMedia from "../components/profile/ProfileMedia";
import ProfileSaved from "../components/profile/ProfileSaved";
import EditProfileDialog from "../components/profile/EditProfileDialog";

export default function Profile() {
  const { profile } = useProfile();
const [postsCount, setPostsCount] = useState(0);

useEffect(() => {
  async function loadCount() {
    if (!profile?.id) return;

    const { data } = await PostService.getUserPosts(profile.id);
    setPostsCount(data?.length || 0);
  }

  loadCount();
}, [profile]);
  const [tab, setTab] = useState("Posts");
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        <ProfileHeader
          profile={profile}
          onEdit={() => setOpenEdit(true)}
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

        <EditProfileDialog
          open={openEdit}
          profile={profile}
          onClose={() => setOpenEdit(false)}
        />

      </div>
    </DashboardLayout>
  );
}

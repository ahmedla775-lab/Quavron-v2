import { useState } from "react";

import DashboardLayout from "../components/dashboard/DashboardLayout";

import { useProfile } from "../context/ProfileContext";

import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileStats from "../components/profile/ProfileStats";
import ProfileTabs from "../components/profile/ProfileTabs";
import ProfilePosts from "../components/profile/ProfilePosts";
import ProfileMedia from "../components/profile/ProfileMedia";
import ProfileSaved from "../components/profile/ProfileSaved";
import ProfileAbout from "../components/profile/ProfileAbout";
import EditProfileDialog from "../components/profile/EditProfileDialog";

export default function Profile() {

  const { profile } = useProfile();

  const [tab, setTab] = useState("Posts");

  const [openEdit, setOpenEdit] = useState(false);

  return (

    <DashboardLayout>

      <div className="mx-auto max-w-6xl p-6">

        <ProfileHeader
          profile={profile}
          onEdit={() => setOpenEdit(true)}
        />

        <ProfileStats
          profile={profile}
        />

        <ProfileTabs
          activeTab={tab}
          onChange={setTab}
        />

        {tab === "Posts" && (

          <ProfilePosts
            profile={profile}
          />

        )}

        {tab === "Media" && (

          <ProfileMedia
            profile={profile}
          />

        )}

        {tab === "Saved" && (

          <ProfileSaved
            profile={profile}
          />

        )}

        {tab === "About" && (

          <ProfileAbout
            profile={profile}
          />

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

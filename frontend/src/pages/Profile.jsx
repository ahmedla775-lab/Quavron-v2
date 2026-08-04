import { useState } from "react";
import { useNavigate } from "react-router-dom";


import DashboardLayout from "../components/dashboard/DashboardLayout";

import { useProfile } from "../context/ProfileContext";

import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileStats from "../components/profile/ProfileStats";
import ProfileTabs from "../components/profile/ProfileTabs";
import ProfileContent from "../components/profile/ProfileContent";
import EditProfileDialog from "../components/profile/EditProfileDialog";


export default function Profile() {

  const {

  profile,

  updateAvatar,

  updateCover,

} = useProfile();

  const navigate = useNavigate();

  const [tab, setTab] = useState("Posts");

  const [openEdit, setOpenEdit] = useState(false);

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
          profile={profile}
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

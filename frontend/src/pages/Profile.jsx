import { useState } from "react";

import DashboardLayout from "../components/dashboard/DashboardLayout";

import { useProfile } from "../context/ProfileContext";

import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileStats from "../components/profile/ProfileStats";
import ProfileTabs from "../components/profile/ProfileTabs";
import ProfilePosts from "../components/profile/ProfilePosts";
import ProfileAbout from "../components/profile/ProfileAbout";
import ProfileMedia from "../components/profile/ProfileMedia";
import EditProfileDialog from "../components/profile/EditProfileDialog";

export default function Profile() {

  const { profile } = useProfile();

  const [tab, setTab] = useState("Posts");

  const [openEdit, setOpenEdit] = useState(false);

  return (

    <DashboardLayout>

      <div className="mx-auto max-w-7xl p-6">

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
          <ProfilePosts profile={profile} />
        )}

        {tab === "Media" && (
          <ProfileMedia profile={profile} />
        )}

        {tab === "Projects" && (
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
            Projects coming soon...
          </div>
        )}

        {tab === "Reels" && (
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
            Reels coming soon...
          </div>
        )}

        {tab === "Stories" && (
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
            Stories coming soon...
          </div>
        )}

        {tab === "Activity" && (
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
            Activity timeline coming soon...
          </div>
        )}

        {tab === "About" && (
          <ProfileAbout profile={profile} />
        )}

        {tab === "Saved" && (
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
            Saved posts coming soon...
          </div>
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

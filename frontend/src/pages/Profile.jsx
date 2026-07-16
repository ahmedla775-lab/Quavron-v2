import { useState } from "react";

import DashboardLayout from "../components/dashboard/DashboardLayout";

import { useProfile } from "../context/ProfileContext";

import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileStats from "../components/profile/ProfileStats";
import ProfileTabs from "../components/profile/ProfileTabs";
import ProfilePosts from "../components/profile/ProfilePosts";
import ProfileMedia from "../components/profile/ProfileMedia";
import ProfileAbout from "../components/profile/ProfileAbout";
import EditProfileDialog from "../components/profile/EditProfileDialog";

export default function Profile() {

  const {

    profile,

    loading,

  } = useProfile();

  const [tab, setTab] =
    useState("Posts");

  const [openEdit, setOpenEdit] =
    useState(false);

  if (loading) {

    return (

      <DashboardLayout>

        <div className="flex h-[70vh] items-center justify-center">

          <div className="text-xl text-slate-400">

            Loading profile...

          </div>

        </div>

      </DashboardLayout>

    );

  }

  if (!profile) {

    return (

      <DashboardLayout>

        <div className="flex h-[70vh] items-center justify-center">

          <div className="text-xl text-red-400">

            Profile not found.

          </div>

        </div>

      </DashboardLayout>

    );

  }

  return (

    <DashboardLayout>

      <div className="mx-auto max-w-7xl px-5 py-8">

        <ProfileHeader

          profile={profile}

          onEdit={() =>

            setOpenEdit(true)

          }

        />

        <ProfileStats

          profile={profile}

        />

        <ProfileTabs

          profile={profile}

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

        {tab === "About" && (

          <ProfileAbout

            profile={profile}

          />

        )}

        {tab === "Saved" && (

          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 p-10 text-center text-slate-400">

            Saved posts feature will be available soon.

          </div>

        )}

      </div>

      <EditProfileDialog

        open={openEdit}

        profile={profile}

        onClose={() =>

          setOpenEdit(false)

        }

      />

    </DashboardLayout>

  );

}

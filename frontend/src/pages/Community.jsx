import { useState } from "react";
import { Menu, X } from "lucide-react";

import DashboardLayout from "../components/dashboard/DashboardLayout";

import CommunityLayout from "../components/community/CommunityLayout";
import CommunityHeader from "../components/community/CommunityHeader";

import Sidebar from "../components/community/Sidebar";
import Feed from "../components/community/Feed";
import RightSidebar from "../components/community/RightSidebar";
import TrendingBar from "../components/community/TrendingBar";

import Explore from "../components/community/sections/Explore";
import Reels from "../components/community/sections/Reels";
import Videos from "../components/community/sections/Videos";
import Developers from "../components/community/sections/Developers";
import Projects from "../components/community/sections/Projects";
import Jobs from "../components/community/sections/Jobs";
import SocialHub from "../components/community/sections/SocialHub";
import Messages from "../components/community/sections/Messages";
import Notifications from "../components/community/sections/Notifications";
import Saved from "../components/community/sections/Saved";

import useResponsive from "../hooks/useResponsive";

export default function Community() {
  const { isDesktop } = useResponsive();

  const [communityMenu, setCommunityMenu] = useState(false);
  const [activeSection, setActiveSection] = useState("Home");

  const sidebar = (
    <Sidebar
      active={activeSection}
      onChange={(section) => {
        setActiveSection(section);
        setCommunityMenu(false);
      }}
    />
  );

  function renderSection() {
    switch (activeSection) {
      case "Home":
        return (
          <>
            {isDesktop && <TrendingBar />}
            <Feed />
          </>
        );

      case "Explore":
        return <Explore />;

      case "Reels":
        return <Reels />;

      case "Videos":
        return <Videos />;

      case "Developers":
        return <Developers />;

      case "Projects":
        return <Projects />;

      case "Jobs":
        return <Jobs />;

      case "Social Hub":
        return <SocialHub />;

      case "Messages":
        return <Messages />;

      case "Notifications":
        return <Notifications />;

      case "Saved":
        return <Saved />;

      default:
        return (
          <>
            {isDesktop && <TrendingBar />}
            <Feed />
          </>
        );
    }
  }

  return (
    <DashboardLayout>
      <div className="relative h-full w-full">

        {!isDesktop && (
          <button
            onClick={() => setCommunityMenu(true)}
            className="
              fixed
              left-5
              bottom-24
              z-[60]
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              bg-[var(--q-primary)]
              text-white
              shadow-xl
              transition
              hover:scale-105
              active:scale-95
            "
          >
            <Menu size={24} />
          </button>
        )}

        {!isDesktop && communityMenu && (
          <>
            <div
              onClick={() => setCommunityMenu(false)}
              className="fixed inset-0 z-[70] bg-black/60"
            />

            <aside
              className="
                fixed
                left-0
                top-0
                z-[80]
                h-screen
                w-72
                border-r
                border-[var(--q-border)]
                bg-[var(--q-surface)]
              "
            >
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setCommunityMenu(false)}
                  className="text-[var(--q-text)]"
                >
                  <X size={24} />
                </button>
              </div>

              {sidebar}
            </aside>
          </>
        )}

        <CommunityLayout
          header={isDesktop ? <CommunityHeader /> : null}
          sidebar={isDesktop ? sidebar : null}
          feed={renderSection()}
          rightSidebar={<RightSidebar />}
        />
      </div>
    </DashboardLayout>
  );
}

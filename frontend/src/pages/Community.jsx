import { useState } from "react";
import { Menu, X } from "lucide-react";
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

import DashboardLayout from "../components/dashboard/DashboardLayout";

import CommunityLayout from "../components/community/CommunityLayout";
import CommunityHeader from "../components/community/CommunityHeader";

import Sidebar from "../components/community/Sidebar";
import Feed from "../components/community/Feed";
import RightSidebar from "../components/community/RightSidebar";

import TrendingBar from "../components/community/TrendingBar";

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
          <TrendingBar />
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
          <TrendingBar />
          <Feed />
        </>
      );
  }
}

  return (

    <DashboardLayout>


      <div
        className="
          relative
          h-full
          w-full
          min-w-0
          overflow-hidden
        "
      >


        {/* Mobile Menu Button */}

        {!isDesktop && (

          <button
            onClick={() => setCommunityMenu(true)}
            className="
              fixed
              bottom-5
              left-5
              z-40
              rounded-full
              bg-blue-600
              p-3
              shadow-lg
              text-white
            "
          >
            <Menu size={22}/>
          </button>

        )}



        {/* Mobile Drawer */}

        {!isDesktop && communityMenu && (

          <>

            <div
              onClick={() => setCommunityMenu(false)}
              className="
                fixed
                inset-0
                z-40
                bg-black/60
              "
            />


            <aside
              className="
                fixed
                left-0
                top-0
                z-50
                h-screen
                w-72
                bg-slate-900
                border-r
                border-slate-800
              "
            >

              <div
                className="
                  flex
                  justify-end
                  p-4
                "
              >

                <button
                  onClick={() => setCommunityMenu(false)}
                  className="text-white"
                >
                  <X size={24}/>
                </button>

              </div>


              {sidebar}


            </aside>


          </>

        )}



        <CommunityLayout

          header={
            <CommunityHeader />
          }

          sidebar={
            isDesktop ? sidebar : null
          }

          feed={renderSection()}

          rightSidebar={
            <RightSidebar />
          }

        />


      </div>


    </DashboardLayout>

  );

}

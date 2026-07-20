import useResponsive from "../../hooks/useResponsive";

export default function CommunityLayout({
  header,
  sidebar,
  feed,
  rightSidebar,
}) {
  const {
    isDesktop,
    isTablet,
  } = useResponsive();


  return (
    <div
      className="
        flex
        h-full
        w-full
        min-w-0
        flex-col
        overflow-hidden
        bg-slate-950
        text-white
      "
    >

      {/* Community Header */}

      {header && (
        <div className="shrink-0">
          {header}
        </div>
      )}



      <div
        className="
          flex
          min-h-0
          flex-1
          w-full
        "
      >

        {/* Left Sidebar */}

        {isDesktop && (
          <aside
            className="
              w-72
              shrink-0
              overflow-y-auto
              border-r
              border-slate-800
            "
          >
            {sidebar}
          </aside>
        )}



        {/* Feed */}

        <main
          className="
            min-w-0
            flex-1
            overflow-hidden
          "
        >
          {feed}
        </main>



        {/* Right Sidebar */}

        {isDesktop && (
          <aside
            className="
              w-80
              shrink-0
              overflow-y-auto
              border-l
              border-slate-800
            "
          >
            {rightSidebar}
          </aside>
        )}



        {/* Tablet preparation */}

        {isTablet && (
          <div className="hidden">
            {rightSidebar}
          </div>
        )}


      </div>

    </div>
  );
}

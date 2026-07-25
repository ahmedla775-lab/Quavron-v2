import useResponsive from "../../hooks/useResponsive";

export default function CommunityLayout({
  header,
  sidebar,
  feed,
  rightSidebar,
}) {
  const { isDesktop } = useResponsive();

  return (
    <div
      className="
        flex
        h-full
        min-h-0
        w-full
        flex-col
        overflow-hidden
        bg-slate-950
        text-white
      "
    >
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
          overflow-hidden
        "
      >
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

        <main
          className="
            min-w-0
            flex-1
            overflow-y-auto
            overflow-x-hidden
          "
        >
          {feed}
        </main>

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
      </div>
    </div>
  );
}

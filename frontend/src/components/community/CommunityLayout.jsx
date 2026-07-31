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
        bg-[var(--q-bg)]
        text-[var(--q-text)]
      "
    >
      {header && (
        <header
          className="
            shrink-0
            border-b
            border-[var(--q-border)]
            bg-[var(--q-surface)]
          "
        >
          {header}
        </header>
      )}

      <div
        className="
          flex
          min-h-0
          flex-1
          w-full
          bg-[var(--q-bg)]
        "
      >
        {isDesktop && (
          <aside
            className="
              w-72
              shrink-0
              overflow-y-auto
              border-r
              border-[var(--q-border)]
              bg-[var(--q-surface)]
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
            bg-[var(--q-bg)]
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
              border-[var(--q-border)]
              bg-[var(--q-surface)]
            "
          >
            {rightSidebar}
          </aside>
        )}
      </div>
    </div>
  );
}

import useResponsive from "../../hooks/useResponsive";

export default function CommunityHeader() {
  const { isMobile } = useResponsive();

  return (
    <header
      className="
        sticky
        top-0
        z-20
        border-b
        border-[var(--q-border)]
        bg-[var(--q-surface)]
        backdrop-blur
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          gap-3
          px-4
          py-4
          sm:px-6
        "
      >
        <div className="min-w-0 flex-1">
          <h1
            className="
              truncate
              text-xl
              font-bold
              text-[var(--q-text)]
              sm:text-2xl
            "
          >
            Community
          </h1>

          {!isMobile && (
            <p className="mt-1 text-sm text-[var(--q-muted)]">
              Connect, share and build with the Quavron community
            </p>
          )}
        </div>

        <button
          className="
            shrink-0
            rounded-xl
            bg-[var(--q-primary)]
            px-4
            py-2
            text-sm
            font-semibold
            text-white
            transition
            hover:opacity-90
            active:scale-95
          "
        >
          Discover
        </button>
      </div>
    </header>
  );
}

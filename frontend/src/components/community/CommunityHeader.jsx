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
        border-slate-800
        bg-slate-950/95
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
              text-white
              sm:text-2xl
            "
          >
            Community
          </h1>

          {!isMobile && (
            <p className="mt-1 text-sm text-slate-400">
              Connect, share and build with the Quavron community
            </p>
          )}
        </div>

        <button
          className="
            shrink-0
            rounded-xl
            bg-blue-600
            px-4
            py-2
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-blue-700
            active:scale-95
          "
        >
          Discover
        </button>
      </div>
    </header>
  );
}

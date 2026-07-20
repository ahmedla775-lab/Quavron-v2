export default function CommunityHeader() {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        border-b
        border-slate-800
        bg-slate-950
        px-4
        py-4
      "
    >

      <div>
        <h1 className="text-2xl font-bold text-white">
          Community
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Connect, share and build with the Quavron community
        </p>
      </div>


      <div className="hidden md:flex items-center gap-3">

        <button
          className="
            rounded-xl
            bg-blue-600
            px-4
            py-2
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-blue-700
          "
        >
          Discover
        </button>

      </div>


    </div>
  );
}

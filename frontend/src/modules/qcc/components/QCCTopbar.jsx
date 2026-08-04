import { Bell, Search, ShieldCheck } from "lucide-react";

export default function QCCTopbar() {

  return (

    <header
      className="
        sticky
        top-0
        z-30
        flex
        h-20
        items-center
        justify-between
        border-b
        border-[var(--q-border)]
        bg-[var(--q-surface)]
        px-6
        backdrop-blur
      "
    >

      {/* Left */}

      <div>

        <h2
          className="
            text-2xl
            font-bold
            text-[var(--q-text)]
          "
        >
          Quavron Control Center
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-[var(--q-muted)]
          "
        >
          Corporate Management Platform
        </p>

      </div>

      {/* Right */}

      <div className="flex items-center gap-4">

        <button
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            border
            border-[var(--q-border)]
            bg-[var(--q-card)]
            transition
            hover:scale-105
          "
        >
          <Search size={18} />
        </button>

        <button
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            border
            border-[var(--q-border)]
            bg-[var(--q-card)]
            transition
            hover:scale-105
          "
        >
          <Bell size={18} />
        </button>

        <div
          className="
            flex
            items-center
            gap-3
            rounded-xl
            border
            border-[var(--q-border)]
            bg-[var(--q-card)]
            px-4
            py-2
          "
        >

          <ShieldCheck
            size={20}
            className="text-[var(--q-primary)]"
          />

          <div>

            <div
              className="
                text-sm
                font-semibold
                text-[var(--q-text)]
              "
            >
              Owner
            </div>

            <div
              className="
                text-xs
                text-[var(--q-muted)]
              "
            >
              Full Access
            </div>

          </div>

        </div>

      </div>

    </header>

  );

}

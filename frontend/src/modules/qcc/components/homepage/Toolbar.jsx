import {
  Save,
  Eye,
  RefreshCw,
  Upload,
  Monitor,
  Smartphone,
} from "lucide-react";

export default function Toolbar() {

  return (

    <div
      className="
        flex
        flex-wrap
        items-center
        justify-between
        gap-4
        rounded-2xl
        border
        border-[var(--q-border)]
        bg-[var(--q-card)]
        p-4
      "
    >

      <div>

        <h2
          className="
            text-xl
            font-bold
            text-[var(--q-text)]
          "
        >
          Homepage Builder
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-[var(--q-muted)]
          "
        >
          Design and manage the public homepage.
        </p>

      </div>

      <div className="flex flex-wrap gap-3">

        <button
          className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-[var(--q-border)]
            px-4
            py-2
            hover:bg-[var(--q-bg)]
          "
        >
          <Monitor size={18} />
          Desktop
        </button>

        <button
          className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-[var(--q-border)]
            px-4
            py-2
            hover:bg-[var(--q-bg)]
          "
        >
          <Smartphone size={18} />
          Mobile
        </button>

        <button
          className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-[var(--q-border)]
            px-4
            py-2
            hover:bg-[var(--q-bg)]
          "
        >
          <RefreshCw size={18} />
          Refresh
        </button>

        <button
          className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-[var(--q-border)]
            px-4
            py-2
            hover:bg-[var(--q-bg)]
          "
        >
          <Eye size={18} />
          Preview
        </button>

        <button
          className="
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-[var(--q-border)]
            px-4
            py-2
            hover:bg-[var(--q-bg)]
          "
        >
          <Upload size={18} />
          Publish
        </button>

        <button
          className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-[var(--q-primary)]
            px-5
            py-2
            text-white
          "
        >
          <Save size={18} />
          Save Draft
        </button>

      </div>

    </div>

  );

}

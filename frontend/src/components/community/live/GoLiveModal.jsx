import { useNavigate } from "react-router-dom";
import {
  X,
  Radio,
  Code2,
  Swords,
  ChevronRight,
} from "lucide-react";

export default function GoLiveModal({
  open,
  onClose,
}) {

  const navigate = useNavigate();

  if (!open) return null;

  function startLive(category) {

    onClose();

    navigate("/community/live", {
      state: {
        category,
      },
    });

  }

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/70"
      />

      <div
        className="
          fixed
          left-1/2
          top-1/2
          z-50
          w-[95%]
          max-w-lg
          -translate-x-1/2
          -translate-y-1/2
          rounded-3xl
          border
          border-slate-700
          bg-slate-900
          shadow-2xl
        "
      >

        <div className="flex items-center justify-between border-b border-slate-800 p-5">

          <h2 className="text-xl font-bold text-white">
            Go Live
          </h2>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X size={22}/>
          </button>

        </div>

        <div className="space-y-4 p-5">

          <Card
            icon={<Radio className="text-red-500"/>}
            title="Public Live"
            description="Start a public livestream."
            onClick={() => startLive("public")}
          />

          <Card
            icon={<Code2 className="text-blue-500"/>}
            title="Tech Live"
            description="Programming • AI • Education • Cybersecurity"
            onClick={() => startLive("tech")}
          />

          <Card
            icon={<Swords className="text-yellow-500"/>}
            title="Live Battles"
            description="Challenge friends or random users."
            onClick={() => startLive("battle")}
          />

        </div>

      </div>
    </>
  );

}

function Card({
  icon,
  title,
  description,
  onClick,
}) {

  return (

    <button
      onClick={onClick}
      className="
        flex
        w-full
        items-center
        justify-between
        rounded-2xl
        border
        border-slate-700
        bg-slate-800
        p-5
        transition
        hover:border-blue-500
        hover:bg-slate-700
      "
    >

      <div className="flex items-center gap-4">

        <div className="rounded-xl bg-slate-900 p-3">
          {icon}
        </div>

        <div className="text-left">

          <h3 className="font-semibold text-white">
            {title}
          </h3>

          <p className="text-sm text-slate-400">
            {description}
          </p>

        </div>

      </div>

      <ChevronRight className="text-slate-500"/>

    </button>

  );

}

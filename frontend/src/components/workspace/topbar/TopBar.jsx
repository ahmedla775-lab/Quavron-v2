import BackButton from "../../common/BackButton";

import {
  FolderOpen,
  Search,
  GitBranch,
  Play,
  Bell,
  Menu,
} from "lucide-react";

import useMobile from "../../../hooks/useMobile";

export default function TopBar({
  onMenu,
}) {

  const mobile = useMobile();

  return (
    <div className="flex h-14 items-center justify-between border-b border-slate-800 bg-slate-900 px-3">

      <div className="flex items-center gap-3">

        <BackButton />

        <span className="text-base font-semibold text-white">
          Quavron IDE
        </span>

      </div>

      <div className="flex items-center gap-3 text-slate-400">

        {!mobile && (
          <>
            <FolderOpen size={18} />

            <Search size={18} />

            <GitBranch size={18} />

            <Play size={18} />

            <Bell size={18} />
          </>
        )}

        {mobile && (
          <button
            onClick={onMenu}
            className="rounded-lg border border-slate-700 bg-slate-800 p-2 transition hover:bg-slate-700"
          >
            <Menu size={20} />
          </button>
        )}

      </div>

    </div>
  );
}

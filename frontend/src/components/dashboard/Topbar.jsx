import {
  Bell,
  Search,
  UserCircle,
} from "lucide-react";

import Input from "../ui/Input";

import { useAuth } from "../auth/AuthProvider";
import { useProfile } from "../../context/ProfileContext";

export default function Topbar() {

  const { user } = useAuth();

  const { profile } = useProfile();

  return (

    <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-8 py-5">

      <div className="w-full max-w-md">

        <Input
          placeholder="Search projects, files, AI..."
        />

      </div>

      <div className="flex items-center gap-6">

        <button className="relative rounded-xl p-2 transition hover:bg-slate-800">

          <Bell size={22} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>

        </button>

        <div className="flex items-center gap-3">

          <UserCircle
            size={40}
            className="text-blue-500"
          />

          <div>

            <p className="font-semibold text-white">
              {profile?.full_name || "Quavron User"}
            </p>

            <p className="text-sm text-slate-400">
              {profile?.username || user?.email || ""}
            </p>

          </div>

        </div>

      </div>

    </header>

  );

}

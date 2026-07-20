import { useProfile } from "../../../context/ProfileContext";
import ProfileSaved from "../../profile/ProfileSaved";

export default function Saved() {
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <div className="p-6 text-slate-400">
        Loading...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 text-slate-400">
        Profile not found.
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-slate-950">
      <div className="border-b border-slate-800 p-4">
        <h2 className="text-2xl font-bold text-white">
          Saved Posts
        </h2>

        <p className="mt-1 text-slate-400">
          All your bookmarked posts.
        </p>
      </div>

      <ProfileSaved profile={profile} />
    </div>
  );
}

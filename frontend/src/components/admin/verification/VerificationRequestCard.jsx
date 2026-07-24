import VerificationBadge from "../../profile/VerificationBadge";

const STATUS = {
  pending: {
    text: "Pending",
    color: "text-yellow-400",
    bg: "bg-yellow-500/15",
  },
  approved: {
    text: "Approved",
    color: "text-sky-400",
    bg: "bg-sky-500/15",
  },
  rejected: {
    text: "Rejected",
    color: "text-red-400",
    bg: "bg-red-500/15",
  },
};

export default function VerificationRequestCard({
  request,
  onOpen,
}) {

  const profile = request.profiles || {};

  const status =
    STATUS[request.status] ||
    STATUS.pending;

  return (

    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          <img
            src={
              profile.avatar_url ||
              "https://ui-avatars.com/api/?background=2563eb&color=fff&name=" +
                encodeURIComponent(profile.username || "Q")
            }
            alt=""
            className="h-16 w-16 rounded-full object-cover"
          />

          <div>

            <div className="flex items-center gap-2">

              <h3 className="text-lg font-semibold text-white">
                {profile.full_name || "Unknown User"}
              </h3>

              <VerificationBadge
                verified={profile.verified}
                type={profile.verification_type}
                size={18}
              />

            </div>

            <p className="text-slate-400">
              @{profile.username}
            </p>

            <p className="mt-2 text-sm text-slate-500">

              {request.account_type || "person"}

            </p>

          </div>

        </div>

        <div className="text-right">

          <div
            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${status.bg} ${status.color}`}
          >
            {status.text}
          </div>

          <p className="mt-3 text-xs text-slate-500">

            {new Date(
              request.created_at
            ).toLocaleString()}

          </p>

          <button
            onClick={onOpen}
            className="mt-4 rounded-xl bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
          >
            Review
          </button>

        </div>

      </div>

    </div>

  );

}

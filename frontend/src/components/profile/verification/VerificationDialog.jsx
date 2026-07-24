import { useEffect, useState } from "react";

import VerificationRequestService from "../../../services/VerificationRequestService";

export default function VerificationDialog({
  profile,
  open,
  onClose,
}) {

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadRequest() {

    if (!profile) return;

    const { data } =
      await VerificationRequestService.getMyRequest(
        profile.id
      );

    setRequest(data);

  }

  useEffect(() => {

    if (open && profile) {

      loadRequest();

    }

  }, [open, profile]);

  async function submitRequest() {

    setLoading(true);

    const { error } =
      await VerificationRequestService.create({

        user_id: profile.id,

        status: "pending",

      });

    setLoading(false);

    if (error) {

      alert(error.message);

      return;

    }

    await loadRequest();

  }

  if (!open) return null;

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

      <div className="w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">

        <h2 className="mb-2 text-3xl font-bold text-white">
          Account Verification
        </h2>

        <p className="mb-8 text-slate-400">
          Verify your identity to receive the official Quavron verification badge.
        </p>

        {profile?.verified ? (

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">

            <p className="text-lg font-semibold text-emerald-400">
              ✅ Your account is verified.
            </p>

            <p className="mt-2 text-sm text-slate-300">
              Your profile already has the official Quavron verification badge.
            </p>

          </div>

        ) : request ? (

          <div className="space-y-4">

            <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5">

              <h3 className="mb-3 font-semibold text-white">
                Verification Status
              </h3>

              {request.status === "pending" && (

                <div>

                  <p className="text-lg font-semibold text-yellow-400">
                    🟡 Pending Review
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    Your request has been received and is waiting for review by the Quavron team.
                  </p>

                </div>

              )}

              {request.status === "approved" && (

                <div>

                  <p className="text-lg font-semibold text-sky-400">
                    🔵 Approved
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    Congratulations! Your account has been verified.
                  </p>

                </div>

              )}

              {request.status === "rejected" && (

                <div>

                  <p className="text-lg font-semibold text-red-400">
                    🔴 Rejected
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    Your request was rejected. You may submit a new request after updating your information.
                  </p>

                  {request.rejection_reason && (

                    <div className="mt-4 rounded-xl bg-slate-900 p-3">

                      <p className="text-sm text-slate-300">
                        Reason:
                      </p>

                      <p className="mt-1 text-sm text-red-300">
                        {request.rejection_reason}
                      </p>

                    </div>

                  )}

                </div>

              )}

            </div>

          </div>

        ) : (

          <div>

            <div className="mb-6 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-5">

              <p className="text-slate-300">
                Request verification to receive the official blue badge and prove the authenticity of your account.
              </p>

            </div>

            <button
              disabled={loading}
              onClick={submitRequest}
              className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Submitting..."
                : "Request Verification"}
            </button>

          </div>

        )}

        <div className="mt-8 flex justify-end">

          <button
            onClick={onClose}
            className="rounded-xl bg-slate-700 px-6 py-3 text-white transition hover:bg-slate-600"
          >
            Close
          </button>

        </div>

      </div>

    </div>

  );

}

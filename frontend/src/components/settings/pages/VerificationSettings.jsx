import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import VerificationDialog from "../../profile/verification/VerificationDialog";
import VerificationBadge from "../../profile/VerificationBadge";
import { VERIFICATION_TYPES } from "../../../constants/verification";

export default function VerificationSettings() {

  const { user } = useAuth();

  const [open, setOpen] = useState(false);

  const [profile, setProfile] = useState(null);

  useEffect(() => {

    if (!user) return;

    setProfile({

      id: user.id,

      username: user.user_metadata?.username || "",

      full_name: user.user_metadata?.full_name || "",

      verified: user.user_metadata?.verified || false,

      verification_type:
        user.user_metadata?.verification_type ||
        VERIFICATION_TYPES.NONE,

    });

  }, [user]);

  if (!profile) return null;

  return (

    <div className="mx-auto max-w-5xl p-8">

      <h1 className="text-3xl font-bold text-[var(--q-text)]">

        Verification

      </h1>

      <p className="mt-2 text-[var(--q-muted)]">

        Verify your identity to unlock official verification
        badges and increase trust across the Quavron platform.

      </p>

      <div className="mt-10 rounded-2xl border border-[var(--q-border)] bg-[var(--q-surface)]">

        <div className="border-b border-[var(--q-border)] p-3 md:p-6">

          <h2 className="text-xl font-semibold text-[var(--q-text)]">

            Current Status

          </h2>

        </div>

        <div className="flex items-center justify-start md:justify-between p-3 md:p-6">

          <div>

            <p className="text-sm md:text-base md:text-lg font-semibold text-[var(--q-text)]">

              Verification Badge

            </p>

            <p className="mt-2 text-[var(--q-muted)]">

              Your current verification level.

            </p>

          </div>

          <VerificationBadge
            type={profile.verification_type}
            size={32}
          />

        </div>

      </div>

      <div className="mt-8 rounded-2xl border border-[var(--q-border)] bg-[var(--q-surface)]">

        <div className="border-b border-[var(--q-border)] p-3 md:p-6">

          <h2 className="text-xl font-semibold text-[var(--q-text)]">

            Badge Types

          </h2>

        </div>

        <div className="space-y-5 p-3 md:p-6">

          <Row
            type={VERIFICATION_TYPES.BLUE}
            title="Blue Badge"
            description="Official identity verification."
          />

          <Row
            type={VERIFICATION_TYPES.BLACK}
            title="Black Badge"
            description="Official organization or company."
          />

          <Row
            type={VERIFICATION_TYPES.WHITE}
            title="White Badge"
            description="Government or public institution."
          />

          <Row
            type={VERIFICATION_TYPES.GRAY}
            title="Gray Badge"
            description="Trusted contributor."
          />

        </div>

      </div>

      <div className="mt-8 rounded-2xl border border-[var(--q-border)] bg-[var(--q-surface)] p-3 md:p-6">

        <h2 className="text-xl font-semibold text-[var(--q-text)]">

          Request Verification

        </h2>

        <p className="mt-3 text-[var(--q-muted)]">

          Submit your documents for review by the Quavron
          verification team.

        </p>

        <button
          onClick={() => setOpen(true)}
          className="
            mt-6
            rounded-xl
            bg-blue-600
            px-8
            py-3
            font-semibold
            text-[var(--q-text)]
            hover:bg-blue-700
          "
        >

          Open Verification Center

        </button>

      </div>

      <VerificationDialog
        open={open}
        onClose={() => setOpen(false)}
        profile={profile}
      />

    </div>

  );

}

function Row({

  type,

  title,

  description,

}) {

  return (

    <div className="flex items-center gap-3">

      <VerificationBadge
        type={type}
        size={24}
      />

      <div>

        <h3 className="font-semibold text-[var(--q-text)]">

          {title}

        </h3>

        <p className="text-sm text-[var(--q-muted)]">

          {description}

        </p>

      </div>

    </div>

  );

}

import {
  ArrowLeft,
  Camera,
  Edit,
  Share2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import VerificationBadge from "./VerificationBadge";
import ImageUploader from "./ImageUploader";

export default function ProfileHeader({

  profile,

  onEdit,

  onAvatarChange,

  onCoverChange,

  following = false,

  loadingFollow = false,

  onFollow,

}) {

  const navigate = useNavigate();

  const editable =
    typeof onEdit === "function";

  return (

    <div className="overflow-hidden rounded-3xl border border-[var(--q-border)] bg-[var(--q-surface)]">

      <div className="relative h-56 w-full bg-[var(--q-card)]">

        <img
          src={
            profile?.cover_url ||
            "/branding/logo-symbol.png"
          }
          alt=""
          className="h-full w-full object-cover"
        />

        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 rounded-xl bg-black/60 p-2 text-[var(--q-text)] backdrop-blur hover:bg-black/80"
        >
          <ArrowLeft size={20}/>
        </button>

        <button
          className="absolute right-4 top-4 rounded-xl bg-black/60 p-2 text-[var(--q-text)] backdrop-blur hover:bg-black/80"
        >
          <Share2 size={20}/>
        </button>

        {editable && (

          <button
            onClick={onEdit}
            className="absolute right-16 top-4 rounded-xl bg-[var(--q-primary)] p-2 text-[var(--q-text)] hover:opacity-90"
          >
            <Edit size={20}/>
          </button>

        )}

        {editable && (

          <ImageUploader
            onSelect={onCoverChange}
          >

            <button
              className="absolute bottom-4 right-4 rounded-xl bg-[var(--q-primary)] p-2 text-[var(--q-text)] hover:opacity-90"
            >
              <Camera size={18}/>
            </button>

          </ImageUploader>

        )}

      </div>

      <div className="relative px-4 pb-6 md:px-8 md:pb-8">

        <div className="-mt-16 flex flex-col items-center gap-6 text-center md:flex-row md:items-end md:text-left">

          <div className="relative">

            <img
              src={
                profile?.avatar_url ||
                "https://ui-avatars.com/api/?background=2563eb&color=fff&name=Q"
              }
              alt=""
              className="h-24 w-24 rounded-full border-4 border-[var(--q-surface)] object-cover md:h-32 md:w-32"
            />

            {editable && (

              <ImageUploader
                onSelect={onAvatarChange}
              >

                <button
                  className="absolute bottom-2 right-2 rounded-full bg-[var(--q-primary)] p-2 text-[var(--q-text)] hover:opacity-90"
                >
                  <Camera size={16}/>
                </button>

              </ImageUploader>

            )}

          </div>

          <div className="flex-1 w-full">
            <div className="flex items-center justify-center gap-2 md:justify-start">

              <h1 className="flex items-center justify-center gap-2 text-2xl font-bold text-[var(--q-text)] md:justify-start md:text-3xl">

                <span>

                  {profile?.full_name}

                </span>

                <VerificationBadge
                  verified={!!profile?.verification_type}
                  type={profile?.verification_type}
                  size={22}
                />

              </h1>

            </div>

            <p className="mt-1 text-[var(--q-muted)]">

              @{profile?.username}

            </p>

            <p className="mt-4 max-w-3xl text-[var(--q-text)]">

              {profile?.bio}

            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-3 md:justify-start">

              {editable ? (

                <button
                  onClick={onEdit}
                  className="rounded-xl bg-[var(--q-primary)] px-5 py-2 text-[var(--q-text)] transition hover:opacity-90"
                >

                  Edit Profile

                </button>

              ) : (

                <button
                  disabled={loadingFollow}
                  onClick={onFollow}
                  className={`rounded-xl px-5 py-2 text-[var(--q-text)] transition ${
                    following
                      ? "bg-[var(--q-card)] hover:opacity-90"
                      : "bg-[var(--q-primary)] hover:opacity-90"
                  }`}
                >

                  {loadingFollow
                    ? "Loading..."
                    : following
                    ? "Following"
                    : "Follow"}

                </button>

              )}

              {!editable && (

                <button
                  className="rounded-xl border border-[var(--q-border)] px-5 py-2 text-[var(--q-text)] transition hover:bg-[var(--q-card)]"
                >

                  Message

                </button>

              )}

              <button
                className="rounded-xl border border-[var(--q-border)] px-5 py-2 text-[var(--q-text)] transition hover:bg-[var(--q-card)]"
              >

                Share Profile

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

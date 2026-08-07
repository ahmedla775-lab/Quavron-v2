import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthProvider";
import { ACCOUNT_TYPE_LABELS } from "../../../constants/accountTypes";
import ProfileService from "../../../services/ProfileService";

export default function IdentitySettings() {

  const { user } = useAuth();

  const [type, setType] = useState("individual");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    async function load() {
      const { data } = await ProfileService.getProfile(user.id);

      if (data?.role) {
        setType(data.role);
      }
    }

    load();
  }, [user]);


  async function saveIdentity() {

    if (!user) return;

    setSaving(true);

    await ProfileService.updateProfile(
      user.id,
      {
        role: type
      }
    );

    setSaving(false);

    alert("Identity updated successfully");
  }


  return (
    <div className="mx-auto max-w-5xl p-8">

      <h1 className="text-3xl font-bold text-[var(--q-text)]">
        Professional Identity
      </h1>

      <p className="mt-2 text-[var(--q-muted)]">
        Choose your role on Quavron platform.
      </p>


      <select
        value={type}
        onChange={(e)=>setType(e.target.value)}
        className="mt-8 rounded-xl border p-4 bg-[var(--q-surface)] text-[var(--q-text)]"
      >

        {Object.entries(ACCOUNT_TYPE_LABELS)
          .map(([key,label])=>(
            <option key={key} value={key}>
              {label}
            </option>
          ))
        }

      </select>


      <div className="mt-8">

        <button
          onClick={saveIdentity}
          disabled={saving}
          className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white"
        >
          {saving ? "Saving..." : "Save Identity"}
        </button>

      </div>


    </div>
  );
}

import { useState } from "react";

import AuthService from "../../services/AuthService";

export default function SecuritySettings() {

  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleChangePassword() {

    if (newPassword !== confirmPassword) {

      alert("Passwords do not match.");

      return;

    }

    if (newPassword.length < 6) {

      alert("Password must contain at least 6 characters.");

      return;

    }

    try {

      setLoading(true);

      const { error } =
        await AuthService.updatePassword(
          newPassword
        );

      if (error) throw error;

      alert("Password updated successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (error) {

      alert(error.message);

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="space-y-6">

      <div>

        <label className="mb-2 block text-slate-300">

          Current Password

        </label>

        <input
          type="password"
          value={currentPassword}
          onChange={(e)=>setCurrentPassword(e.target.value)}
          className="w-full rounded-xl bg-slate-800 p-3 text-white"
        />

      </div>

      <div>

        <label className="mb-2 block text-slate-300">

          New Password

        </label>

        <input
          type="password"
          value={newPassword}
          onChange={(e)=>setNewPassword(e.target.value)}
          className="w-full rounded-xl bg-slate-800 p-3 text-white"
        />

      </div>

      <div>

        <label className="mb-2 block text-slate-300">

          Confirm Password

        </label>

        <input
          type="password"
          value={confirmPassword}
          onChange={(e)=>setConfirmPassword(e.target.value)}
          className="w-full rounded-xl bg-slate-800 p-3 text-white"
        />

      </div>

      <button
        disabled={loading}
        onClick={handleChangePassword}
        className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
      >

        {loading
          ? "Updating..."
          : "Update Password"}

      </button>

    </div>

  );

}

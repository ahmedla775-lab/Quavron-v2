import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

import AuthService from "../services/AuthService";

export default function ResetPassword() {

  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  async function handleSubmit(e) {

    e.preventDefault();

    setError("");

    setSuccess("");

    if (password.length < 8) {

      setError(
        "Password must be at least 8 characters."
      );

      return;

    }

    if (password !== confirmPassword) {

      setError(
        "Passwords do not match."
      );

      return;

    }

    setLoading(true);

    const { error } =
      await AuthService.updatePassword(password);

    setLoading(false);

    if (error) {

      setError(error.message);

      return;

    }

    setSuccess(
      "Password updated successfully."
    );

    setTimeout(() => {

      navigate("/login");

    }, 1500);

  }

  return (

    <AuthLayout
      title="Reset Password"
      subtitle="Choose a new password."
    >

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        <Input
          label="New Password"
          type="password"
          value={password}
          onChange={(e)=>
            setPassword(e.target.value)
          }
        />

        <Input
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e)=>
            setConfirmPassword(
              e.target.value
            )
          }
        />

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >

          {loading
            ? "Updating..."
            : "Update Password"}

        </Button>

        {error && (

          <p className="text-center text-sm text-red-500">

            {error}

          </p>

        )}

        {success && (

          <p className="text-center text-sm text-emerald-500">

            {success}

          </p>

        )}

      </form>

    </AuthLayout>

  );

}

import { useState } from "react";
import { NavLink } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

import AuthService from "../services/AuthService";

export default function ForgotPassword() {

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {

    e.preventDefault();

    setError("");

    setSuccess("");

    if (!email.trim()) {

      setError("Email is required.");

      return;

    }

    setLoading(true);

    const { error } =
      await AuthService.resetPassword(email);

    setLoading(false);

    if (error) {

      setError(error.message);

      return;

    }

    setSuccess(

      "A password reset link has been sent to your email."

    );

  }

  return (

    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email to receive a password reset link."
    >

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >

          {loading
            ? "Sending..."
            : "Send Reset Link"}

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

      <p className="mt-8 text-center">

        <NavLink
          to="/login"
          className="text-blue-400 hover:text-blue-300"
        >

          Back to Login

        </NavLink>

      </p>

    </AuthLayout>

  );

}

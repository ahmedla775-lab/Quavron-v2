import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

import AuthService from "../services/AuthService";

export default function Register() {

  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleRegister(e) {

    e.preventDefault();

    setError("");

    if (!fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const { error } = await AuthService.register(
  fullName,
  email,
  password
);
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    navigate("/login");
  }

  return (

    <AuthLayout
      title="Create Account"
      subtitle="Join Quavron and start building amazing projects."
    >

      <form
        onSubmit={handleRegister}
        className="space-y-5"
      >

        <Input
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </Button>

        {error && (
          <p className="text-center text-sm text-red-500">
            {error}
          </p>
        )}

      </form>

      <p className="mt-8 text-center text-slate-400">

        Already have an account?{" "}

        <NavLink
          to="/login"
          className="font-semibold text-blue-400 hover:text-blue-300"
        >
          Sign In
        </NavLink>

      </p>

    </AuthLayout>

  );

}


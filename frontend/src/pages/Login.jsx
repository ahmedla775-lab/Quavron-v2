import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

import AuthService from "../services/AuthService";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleLogin(e) {

    e.preventDefault();

    setLoading(true);

    setError("");

    const { error } = await AuthService.login(
      email,
      password
    );

    setLoading(false);

    if (error) {

      setError(error.message);

      return;

    }

    navigate("/dashboard");

  }

  return (

    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue to Quavron."
    >

      <form
        onSubmit={handleLogin}
        className="space-y-5"
      >

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
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex justify-end">

          <NavLink
            to="/forgot-password"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Forgot Password?
          </NavLink>

        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </Button>

        {error && (

          <p className="text-center text-sm text-red-500">

            {error}

          </p>

        )}

      </form>

      <p className="mt-8 text-center text-slate-400">

        Don't have an account?{" "}

        <NavLink
          to="/register"
          className="font-semibold text-blue-400 hover:text-blue-300"
        >
          Create Account
        </NavLink>

      </p>

    </AuthLayout>

  );

}


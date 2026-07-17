import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

import AuthService from "../services/AuthService";
import ProfileService from "../services/ProfileService";

export default function Register() {

  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [checkingUsername, setCheckingUsername] =
    useState(false);

  const [usernameAvailable, setUsernameAvailable] =
    useState(null);

  const usernameRegex =
    /^[a-zA-Z0-9_]{3,30}$/;

  useEffect(() => {

    if (!username.trim()) {

      setUsernameAvailable(null);

      return;

    }

    if (!usernameRegex.test(username)) {

      setUsernameAvailable(false);

      return;

    }

    const timer = setTimeout(async () => {

      setCheckingUsername(true);

      const available =
        await ProfileService.isUsernameAvailable(
          username,
          null
        );

      setUsernameAvailable(available);

      setCheckingUsername(false);

    }, 500);

    return () => clearTimeout(timer);

  }, [username]);

  async function handleRegister(e) {

    e.preventDefault();

    setError("");

    if (!fullName.trim()) {

      setError("Full name is required.");

      return;

    }

    if (!username.trim()) {

      setError("Username is required.");

      return;

    }

    if (!usernameRegex.test(username)) {

      setError(
        "Username must contain only letters, numbers and underscore."
      );

      return;

    }

    if (usernameAvailable === false) {

      setError(
        "Username already taken."
      );

      return;

    }

    if (password !== confirmPassword) {

      setError(
        "Passwords do not match."
      );

      return;

    }

    if (password.length < 8) {

      setError(
        "Password must be at least 8 characters."
      );

      return;

    }

    setLoading(true);

    const { error } =
      await AuthService.register(

        fullName,

        username,

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
          onChange={(e) =>
            setFullName(e.target.value)
          }
        />

        <div>

          <Input
            label="Username"
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

          {username.length > 0 && (

            <div className="mt-2 text-sm">

              {checkingUsername ? (

                <p className="text-slate-400">

                  Checking username...

                </p>

              ) : usernameAvailable === true ? (

                <p className="text-emerald-500">

                  ✓ Username available

                </p>

              ) : usernameAvailable === false ? (

                <p className="text-red-500">

                  ✗ Username already taken or invalid

                </p>

              ) : null}

            </div>

          )}

        </div>

        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <Input
          label="Password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
        />

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={
            loading ||
            checkingUsername ||
            usernameAvailable !== true
          }
        >

          {loading
            ? "Creating Account..."
            : "Create Account"}

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

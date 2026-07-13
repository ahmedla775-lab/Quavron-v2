import { NavLink } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function ForgotPassword() {
  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email to receive a password reset link."
    >
      <form className="space-y-5">

        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
        />

        <Button
          type="submit"
          className="w-full"
        >
          Send Reset Link
        </Button>

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


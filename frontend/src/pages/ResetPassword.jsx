import AuthLayout from "../components/auth/AuthLayout";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function ResetPassword() {
  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Create a new secure password."
    >
      <form className="space-y-5">

        <Input
          label="New Password"
          type="password"
          placeholder="New password"
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm password"
        />

        <Button
          type="submit"
          className="w-full"
        >
          Update Password
        </Button>

      </form>

    </AuthLayout>
  );
}


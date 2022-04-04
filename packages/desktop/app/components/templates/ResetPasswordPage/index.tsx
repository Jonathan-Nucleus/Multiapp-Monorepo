import { FC, useState } from "react";
import Button from "../../common/Button";
import Alert from "../../common/Alert";
import Label from "../../common/Label";
import Input from "../../common/Input";

const ResetPasswordPage: FC = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <div className="px-3">
      <div className="container mx-auto max-w-md">
        <h1 className="text-white text-2xl">Welcome back</h1>
        <Alert variant="info" className="mt-6 text-white text-sm">
          Create a new password.
        </Alert>
        <form className="mt-6">
          <div className="hidden">
            <Input type="email" name="email" autocomplete="email" />
          </div>
          <div className="mt-4">
            <div className="flex flex-row justify-between">
              <Label for="password">Password</Label>
              <a
                className="text-sm text-primary cursor-pointer"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? "Hide" : "Show"}
              </a>
            </div>
            <Input
              id="password"
              type={showNewPassword ? "text" : "password"}
              name="password"
              autocomplete="current-password"
              required
            />
          </div>
          <div className="mt-4">
            <div className="flex flex-row justify-between">
              <Label for="confirm-password">Confirm password</Label>
              <a
                className="text-sm text-primary cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </a>
            </div>
            <Input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirm-password"
              autocomplete="confirm-password"
              required
            />
          </div>
          <Button
            variant="gradient-primary"
            className="w-full mt-9 px-10 uppercase"
          >
            save password and sign in
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

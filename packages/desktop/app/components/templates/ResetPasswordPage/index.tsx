import { FC, useState } from "react";
import Button from "../../common/Button";
import Alert from "../../common/Alert";
import Label from "../../common/Label";
import Input from "../../common/Input";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

type FormValues = {
  password: string;
  confirmPassword: string;
};

const schema = yup
  .object({
    password: yup.string().required(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Confirm password mismatch")
      .required(),
  })
  .required();

const ResetPasswordPage: FC = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const onSubmit: SubmitHandler<FormValues> = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="px-3">
      <div className="container mx-auto max-w-md">
        <h1 className="text-white text-2xl">Welcome back</h1>
        <Alert variant="info" className="mt-6 text-white text-sm">
          Create a new password.
        </Alert>
        <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="hidden">
            <Input type="email" name="email" autoComplete="email" />
          </div>
          <div className="mt-4">
            <div className="flex flex-row justify-between">
              <Label htmlFor="password">Password</Label>
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
              autoComplete="current-password"
              {...register("password")}
            />
          </div>
          <div className="mt-4">
            <div className="flex flex-row justify-between">
              <Label htmlFor="confirm-password">Confirm password</Label>
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
              autoComplete="confirm-password"
              {...register("confirmPassword")}
            />
          </div>
          <Button
            variant="gradient-primary"
            className="w-full mt-9 px-10 uppercase"
            disabled={!isValid}
            loading={loading}
          >
            save password and sign in
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

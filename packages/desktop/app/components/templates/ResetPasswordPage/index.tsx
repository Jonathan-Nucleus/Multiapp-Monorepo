import { FC, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { signIn } from "next-auth/react";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import jwt from "jsonwebtoken";
import AppAuthOptions from "../../../config/auth";
import { useResetPassword } from "shared/graphql/mutation/auth/useResetPassword";

import Button from "../../common/Button";
import Alert from "../../common/Alert";
import Label from "../../common/Label";
import Input from "../../common/Input";
import ErrorMessage from "../../common/ErrorMessage";

import { PASSWORD_PATTERN } from "shared/src/patterns";
import { ArrowLeft } from "phosphor-react";

type FormValues = {
  password: string;
  confirmPassword: string;
};

const schema = yup
  .object({
    password: yup
      .string()
      .min(8, "Password must have a minimum length of 8 characters")
      .matches(
        PASSWORD_PATTERN,
        `Oops, your password doesn't meet the following requirements:
        1 number
        1 uppercase letter
        1 lowercase letter
        1 special character (@$!%*?&.^)`
      )
      .required("Required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Confirm password mismatch")
      .required(),
  })
  .required();

interface ResetPasswordPageProps {
  token: string;
}

const ResetPasswordPage: FC<ResetPasswordPageProps> = ({ token }) => {
  const router = useRouter();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    state: "info" | "error";
  }>({
    message: "Create a new password.",
    state: "info",
  });
  const [resetPassword] = useResetPassword();
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const onSubmit: SubmitHandler<FormValues> = async ({ password }) => {
    setLoading(true);
    const { data } = await resetPassword({ variables: { password, token } });
    if (data?.resetPassword) {
      const { email } = jwt.decode(token) as Record<string, string>;
      signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      }).then(async () => {
        setLoading(false);
        await router.replace("/");
      });
    } else {
      setAlert({
        message:
          "Your reset token has expired. Head back to login to generate a new one.",
        state: "error",
      });
      setLoading(false);
    }
  };

  return (
    <div className="px-3">
      <div className="container mx-auto max-w-md">
        {alert.state === "error" ? (
          <>
            <div>
              <Link href={AppAuthOptions.pages?.signIn!!}>
                <a>
                  <Button variant="text" className="text-primary">
                    <ArrowLeft size={32} weight="light" color="currentColor" />
                    <span className="ml-3">Back to Login</span>
                  </Button>
                </a>
              </Link>
            </div>
            <h1 className="text-white text-2xl mt-5">Reset Password</h1>
          </>
        ) : (
          <h1 className="text-white text-2xl">Welcome Back</h1>
        )}
        <Alert variant={alert.state} className="mt-6 text-white text-sm">
          {alert.message}
        </Alert>
        {alert.state !== "error" && (
          <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="hidden">
              <Input type="email" name="email" autoComplete="email" />
            </div>
            <div className="mt-4">
              <div className="flex flex-row justify-between">
                <Label htmlFor="password" name="password" errors={errors}>
                  Password
                </Label>
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
              <ErrorMessage name="password" errors={errors} />
            </div>
            <div className="mt-4">
              <div className="flex flex-row justify-between">
                <Label
                  htmlFor="confirm-password"
                  name="confirmPassword"
                  errors={errors}
                >
                  Confirm password
                </Label>
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
              <ErrorMessage name="confirmPassword" errors={errors} />
            </div>
            <Button
              type="submit"
              variant="gradient-primary"
              className="w-full mt-9 px-10 uppercase"
              disabled={!isValid}
              loading={loading}
            >
              save password and sign in
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;

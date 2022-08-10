import { FC, useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import jwt from "jsonwebtoken";
import { useResetPassword } from "shared/graphql/mutation/auth/useResetPassword";

import Button from "../../common/Button";
import Label from "../../common/Label";
import Input from "../../common/Input";

import { PASSWORD_PATTERN, passwordRequirements } from "shared/src/patterns";
import Image from "next/image";
import LogoWithText from "shared/assets/images/logo-gradient.svg";
import { toast } from "../../common/Toast";
import { CheckCircle, Circle } from "phosphor-react";

type FormValues = {
  password: string;
  confirmPassword: string;
};

const schema = yup
  .object({
    password: yup
      .string()
      .matches(PASSWORD_PATTERN, "Invalid Password")
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
  const [resetPassword] = useResetPassword();
  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid, errors },
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const passwordField = watch("password");
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
      setLoading(false);
      toast.error(
        "Your reset token has expired. Head back to login to generate a new one."
      );
    }
  };

  return (
    <div>
      <div className="text-center py-20">
        <Image src={LogoWithText} alt="" width={238} height={42} />
      </div>
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
          <div className="flex items-center relative mt-3">
            <Input
              id="password"
              type={showNewPassword ? "text" : "password"}
              autoComplete="current-password"
              className="bg-transparent h-12 !rounded-2xl !text-white font-bold border-gray-600 !pl-4 !pr-10"
              isInvalid={!!errors.password}
              {...register("password")}
            />
            {passwordField?.match(PASSWORD_PATTERN) && (
              <CheckCircle
                size={24}
                weight="fill"
                color="currentColor"
                className="text-primary absolute right-2"
              />
            )}
          </div>
        </div>
        <div className="mt-6">
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
            className="bg-transparent h-12 !rounded-2xl !text-white font-bold font-semibold border-gray-600 mt-3 !px-4"
            autoComplete="confirm-password"
            isInvalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
        </div>
        <div className="bg-black/[.2] border border-gray-800 rounded-2xl mt-4 px-5 py-2">
          {passwordRequirements.map(({ label, pattern }, index) => (
            <div key={index} className="flex items-center my-2">
              <div>
                {passwordField?.match(pattern) ? (
                  <CheckCircle
                    size={24}
                    weight="fill"
                    color="currentColor"
                    className="text-primary"
                  />
                ) : (
                  <Circle
                    size={24}
                    weight="bold"
                    color="currentColor"
                    className="text-white/[.38]"
                  />
                )}
              </div>
              <div className="text-sm text-white/[.87] ml-2">{label}</div>
            </div>
          ))}
        </div>
        <Button
          type="submit"
          variant="gradient-primary"
          className="w-full text-sm font-medium h-12 tracking-normal mt-10"
          disabled={!isValid}
          loading={loading}
        >
          Save Password and Sign In
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;

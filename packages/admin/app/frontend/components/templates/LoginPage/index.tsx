import { FC, useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { RedirectableProviderType } from "next-auth/providers";
import { WarningCircle } from "phosphor-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Label from "admin/app/frontend/components/common/Label";
import Button from "admin/app/frontend/components/common/Button";
import Alert from "admin/app/frontend/components/common/Alert";
import AuthInput from "../../common/AuthInput";

type FormValues = {
  email: string;
  password: string;
};

const schema = yup
  .object({
    email: yup.string().email("Must be a valid email").lowercase().required(),
    password: yup.string().min(8).required(),
  })
  .required();

const LoginPage: FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const router = useRouter();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setLoading(true);
    signIn<RedirectableProviderType>("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    }).then(async (response) => {
      setLoading(false);
      if (response?.ok) {
        router.query.redirect
          ? await router.replace(router.query.redirect as string)
          : await router.replace("/");
      } else {
        setError("Your email and/or password are incorrect.");
      }
    });
  };

  return (
    <div className="px-3">
      <div className="container mx-auto max-w-md">
        <h1 className="text-white text-2xl">Admin Login</h1>
        <div className="my-6">
          <div className={error ? "block" : "hidden"}>
            <Alert variant="error">
              <div className="flex flex-row">
                <div className="flex-shrink-0 text-error">
                  <WarningCircle size={24} weight="bold" color="currentColor" />
                </div>
                <div className="text-white ml-3">{error}</div>
              </div>
            </Alert>
          </div>
        </div>
        <form method="post" onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-9">
            <Label htmlFor="email">Email</Label>
            <AuthInput id="email" autoComplete="email" {...register("email")} />
          </div>
          <div className="mt-4">
            <div className="flex flex-row justify-between">
              <Label htmlFor="password">Password</Label>
              <a
                className="text-sm text-primary cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </a>
            </div>
            <AuthInput
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              {...register("password")}
            />
          </div>
          <div className="mt-8">
            <Button
              type="submit"
              variant="gradient-primary"
              className="w-full leading-6"
              disabled={!isValid}
              loading={loading}
            >
              Log In
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

import { FC, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { RedirectableProviderType } from "next-auth/providers";
import { WarningCircle } from "phosphor-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Input from "../../common/Input";
import Label from "../../common/Label";
import Checkbox from "../../common/Checkbox";
import Button from "../../common/Button";
import Alert from "../../common/Alert";
import Apple from "shared/assets/images/apple.svg";
import LinkedIn from "shared/assets/images/linkedin.svg";
import Google from "shared/assets/images/google.svg";

const PROVIDER_ICONS: Record<string, string> = {
  apple: Apple,
  google: Google,
  linkedin: LinkedIn,
};

export interface LoginPageProps {
  ssoProviders: string[];
}

type FormValues = {
  email: string;
  password: string;
  remember: boolean;
};

const schema = yup
  .object({
    email: yup.string().email("Must be a valid email").lowercase().required(),
    password: yup.string().min(8).required(),
    remember: yup.boolean().required().default(false),
  })
  .required();

const LoginPage: FC<LoginPageProps> = ({ ssoProviders }: LoginPageProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSSO, setLoadingSSO] = useState(false);
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
        if (router.query.redirect) {
          await router.replace(router.query.redirect as string);
        } else {
          await router.replace("/");
        }
      } else {
        setError("Your email and/or password are incorrect.");
      }
    });
  };

  return (
    <div className="px-3">
      <div className="container mx-auto max-w-md">
        <h1 className="text-white text-2xl">Login</h1>
        <div className="mt-4">
          <span className="text-white text-sm col-auto">New here?</span>
          <Link href="/invite-code">
            <a className="text-primary text-sm font-bold ml-4">
              Sign up with Code
            </a>
          </Link>
        </div>
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
            <Input id="email" autoComplete="email" {...register("email")} />
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
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              {...register("password")}
            />
          </div>
          <div className="mt-2">
            <Link href="/forgot-password">
              <a className="text-primary text-sm">Forgot Password?</a>
            </Link>
          </div>
          <div className="mt-5 flex flex-row items-center">
            <Checkbox id="remember" {...register("remember")} />
            <Label htmlFor="remember">
              <span className="ml-2">Stay signed in</span>
            </Label>
          </div>
          <div className="mt-8">
            <Button
              type="submit"
              variant="gradient-primary"
              className="w-full leading-6"
              disabled={!isValid || loadingSSO}
              loading={loading}
            >
              Log In
            </Button>
          </div>
        </form>
      </div>
      {ssoProviders.length > 0 && (
        <div className="container max-w-lg mx-auto mt-12">
          <div className="flex items-center justify-center w-full">
            <div className="bg-brand-overlay/[.1] h-px flex-1"></div>
            <div className="text-center text-white mx-4">Or, Log In with</div>
            <div className="bg-brand-overlay/[.1] h-px flex-1"></div>
          </div>
          <div className="flex items-center justify-center mt-8">
            {ssoProviders.map((provider) => (
              <Button
                key={provider}
                variant="outline-primary"
                className="w-12 h-12 md:w-40 md:h-auto rounded-lg md:rounded-full border border-white/[.12] md:border-primary mx-4 px-0 py-0 md:py-2"
                disabled={loadingSSO}
                onClick={async () => {
                  setLoadingSSO(true);
                  await signIn(provider);
                }}
              >
                <span className="hidden md:inline-flex items-center">
                  <Image
                    src={PROVIDER_ICONS[provider]}
                    alt=""
                    width={16}
                    height={16}
                  />
                </span>
                <span className="inline-flex md:hidden items-center">
                  <Image
                    src={PROVIDER_ICONS[provider]}
                    alt=""
                    width={24}
                    height={24}
                  />
                </span>
                <span className="ml-2 capitalize hidden md:inline-block">
                  {provider}
                </span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;

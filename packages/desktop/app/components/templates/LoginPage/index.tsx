import { FC, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { RedirectableProviderType } from "next-auth/providers";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Input from "../../common/Input";
import Label from "../../common/Label";
import Checkbox from "../../common/Checkbox";
import Button from "../../common/Button";
import Apple from "shared/assets/images/apple.svg";
import LinkedIn from "shared/assets/images/linkedin.svg";
import Google from "shared/assets/images/google.svg";
import LogoWithText from "shared/assets/images/logo-gradient.svg";
import { toast } from "../../common/Toast";
import { Transition } from "@headlessui/react";

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
  const [loading, setLoading] = useState(false);
  const [loadingSSO, setLoadingSSO] = useState(false);
  const [step, setStep] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
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
        setStep(1);
        setTimeout(() => {
          setStep(2);
          setTimeout(() => {
            if (router.query.redirect) {
              router.replace(router.query.redirect as string);
            } else {
              router.replace("/");
            }
          }, 1000);
        }, 1000);
      } else {
        toast.error("Invalid email address or password.");
      }
    });
  };

  return (
    <div className="h-screen">
      {step != 2 && (
        <div className="text-center py-20">
          <Image src={LogoWithText} alt="" width={238} height={42} />
        </div>
      )}
      <Transition
        show={step == 2}
        enter="transition-all ease-out duration-1000"
        enterFrom="translate-y-0"
        enterTo="translate-y-verticalCenter"
      >
        <div className="text-center py-20">
          <Image src={LogoWithText} alt="" width={238} height={42} />
        </div>
      </Transition>
      <Transition
        show={step == 0}
        enter="transition-opacity ease-linear duration-1000"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-linear duration-1000"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="text-sm text-white text-center font-medium">
          New here?
          <Link href="/invite-code">
            <a className="text-primary ml-2">Sign up with a code.</a>
          </Link>
        </div>
        <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              autoComplete="email"
              className="bg-transparent h-12 !rounded-2xl !text-white font-semibold border-gray-600 mt-3 !px-4"
              isInvalid={!!errors.email}
              {...register("email")}
            />
          </div>
          <div className="mt-6">
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
              className="bg-transparent h-12 !rounded-2xl !text-white border-gray-600 mt-3 !px-4"
              isInvalid={!!errors.password}
              {...register("password")}
            />
          </div>
          <div className="flex flex-row items-center mt-4">
            <Checkbox id="remember" {...register("remember")} />
            <Label htmlFor="remember">
              <span className="ml-2">Stay signed in</span>
            </Label>
          </div>
          <div className="mt-6">
            <Button
              type="submit"
              variant="gradient-primary"
              className="w-full h-12 text-sm font-medium tracking-normal"
              disabled={!isValid || loadingSSO}
              loading={loading}
            >
              Log In
            </Button>
          </div>
          <div className="text-sm text-white text-center font-medium mt-12">
            Forgot your password?
            <Link href="/forgot-password">
              <a className="text-primary ml-2">Reset it here.</a>
            </Link>
          </div>
        </form>
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
      </Transition>
    </div>
  );
};

export default LoginPage;

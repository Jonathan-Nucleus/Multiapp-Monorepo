import { FC, ReactElement, useState } from "react";
import Link from "next/link";
import Input from "../../common/Input";
import Label from "../../common/Label";
import Checkbox from "../../common/Checkbox";
import Button from "../../common/Button";
import { signIn, getProviders } from "next-auth/react";
import Alert from "../../common/Alert";
import { AppleLogo, GoogleLogo, LinkedinLogo, WarningCircle } from "phosphor-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { RedirectableProviderType } from "next-auth/providers";
import { useRouter } from "next/router";

const PROVIDER_ICONS: Record<string, ReactElement> = {
  apple: <AppleLogo color="white" weight="fill" size={20} />,
  google: <GoogleLogo color="white" weight="bold" size={20} />,
  linkedin: <LinkedinLogo color="white" weight="fill" size={20} />,
};

interface LoginPageProps {
  providers: UnwrapPromise<ReturnType<typeof getProviders>>;
}

type FormValues = {
  email: string;
  password: string;
  remember: boolean;
};

const schema = yup
  .object({
    email: yup.string().email("Must be a valid email").required(),
    password: yup.string().min(8).required(),
    remember: yup.boolean().required().default(false),
  })
  .required();

const LoginPage: FC<LoginPageProps> = ({ providers }: LoginPageProps) => {
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
              disabled={!isValid}
              loading={loading}
            >
              Log In
            </Button>
          </div>
          <div className="mt-12 text-center text-white">Or, Log In with</div>
        </form>
      </div>
      <div className="container mx-auto mt-8 max-w-lg">
        <div className="flex items-center justify-center md:grid grid-cols-3 gap-7">
          {Object.keys(providers).map((provider) =>
            provider === "credentials" ? undefined : (
              <Button
                key={provider}
                variant="outline-primary"
                className="w-12 h-12 md:w-full md:h-auto rounded-lg md:rounded-full border border-gray-400 md:border-primary"
                onClick={() => signIn(provider)}
              >
                {PROVIDER_ICONS[provider]}
                <span className="ml-2 capitalize hidden md:inline-block">
                  {provider}
                </span>
              </Button>
            ),
          )}
          <Button
            variant="outline-primary"
            className="w-12 h-12 md:w-full md:h-auto rounded-lg md:rounded-full border border-gray-400 md:border-primary"
          >
            {PROVIDER_ICONS["apple"]}
            <span className="ml-2 hidden md:inline-block">Apple</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

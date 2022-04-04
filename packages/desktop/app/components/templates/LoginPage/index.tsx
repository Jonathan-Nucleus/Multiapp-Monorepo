import { FC, useRef, useState } from "react";
import Link from "next/link";
import Input from "../../common/Input";
import Label from "../../common/Label";
import Checkbox from "../../common/Checkbox";
import Button from "../../common/Button";
import AppleIcon from "shared/assets/images/apple.svg";
import GoogleIcon from "shared/assets/images/google.svg";
import LinkedInIcon from "shared/assets/images/linkedin.svg";
import WarningIcon from "shared/assets/images/warning-red.svg";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { RedirectableProviderType } from "next-auth/providers";
import { useRouter } from "next/router";
import Alert from "../../common/Alert";

const LoginPage: FC = () => {
  const [passwordType, setPasswordType] = useState("password");
  const formRef = useRef<HTMLFormElement>(null);
  const [isFormValid, setFormValid] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  return (
    <div className="px-3">
      <div className="container mx-auto max-w-md">
        <h1 className="text-white text-2xl">Login</h1>
        <div className="mt-4">
          <span className="text-white text-sm col-auto">New here?</span>
          <Link href="/signup">
            <a className="uppercase text-primary text-sm font-bold ml-4">
              sign up with code
            </a>
          </Link>
        </div>
        <div className="my-6">
          <div className={error ? "block" : "hidden"}>
            <Alert variant="error">
              <div className="flex flex-row">
                <div className="flex-shrink-0 mt-1">
                  <Image src={WarningIcon} alt="" />
                </div>
                <div className="text-white ml-3">{error}</div>
              </div>
            </Alert>
          </div>
        </div>
        <form
          ref={formRef}
          method="post"
          onChange={() => {
            if (formRef.current) {
              const formData = new FormData(formRef.current);
              const formDataObj = Object.fromEntries(formData.entries());
              setFormValid(!!formDataObj.email && !!formDataObj.password);
            }
          }}
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(formRef.current!!);
            const formDataObj = Object.fromEntries(formData.entries());
            setLoading(true);
            signIn<RedirectableProviderType>("credentials", {
              email: formDataObj.email,
              password: formDataObj.password,
              redirect: false,
            }).then(async (response) => {
              setLoading(false);
              if (response?.ok) {
                await router.replace("/");
              } else {
                setError("Your email and/or password are incorrect.");
              }
            });
          }}
        >
          <div className="mt-9">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              autocomplete="email"
              required
            />
          </div>
          <div className="mt-4">
            <div className="flex flex-row justify-between">
              <Label for="password">Password</Label>
              <a
                className="text-sm text-primary cursor-pointer"
                onClick={() => {
                  if (passwordType == "password") {
                    setPasswordType("text");
                  } else {
                    setPasswordType("password");
                  }
                }}
              >
                {passwordType == "password" ? "Show" : "Hide"}
              </a>
            </div>
            <Input
              id="password"
              type={passwordType}
              name="password"
              autocomplete="current-password"
              required
            />
          </div>
          <div className="mt-2">
            <Link href="/forgot-password">
              <a className="text-primary text-sm">Forgot Password?</a>
            </Link>
          </div>
          <div className="mt-5 flex flex-row items-center">
            <Checkbox id="remember" name="remember" />
            <Label for="remember">
              <span className="ml-2">Stay signed in</span>
            </Label>
          </div>
          <div className="mt-8">
            <Button
              type="submit"
              variant="gradient-primary"
              className="w-full uppercase leading-6"
              disabled={!isFormValid}
              loading={loading}
            >
              Log in
            </Button>
          </div>
          <div className="mt-12 text-center text-white">OR, LOG IN WITH</div>
        </form>
      </div>
      <div className="container mx-auto mt-8 max-w-lg">
        <div className="flex items-center justify-center md:grid grid-cols-3 gap-7">
          <Button
            variant="outline-primary"
            className="w-12 h-12 md:w-full md:h-auto rounded-lg md:rounded-full border border-gray-400 md:border-primary"
          >
            <Image src={AppleIcon} alt="" />
            <span className="ml-2 hidden md:inline-block">APPLE</span>
          </Button>
          <Button
            variant="outline-primary"
            className="w-12 h-12 md:w-full md:h-auto rounded-lg md:rounded-full border border-gray-400 md:border-primary"
          >
            <Image src={GoogleIcon} alt="" />
            <span className="ml-2 hidden md:inline-block">GOOGLE</span>
          </Button>
          <Button
            variant="outline-primary"
            className="w-12 h-12 md:w-full md:h-auto rounded-lg md:rounded-full border border-gray-400 md:border-primary"
          >
            <Image src={LinkedInIcon} alt="" />
            <span className="ml-2 hidden md:inline-block">LINKEDIN</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

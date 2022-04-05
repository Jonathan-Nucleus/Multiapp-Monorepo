import { FC, useRef, useState } from "react";
import Input from "../../common/Input";
import Label from "../../common/Label";
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
import Checkbox from "../../common/Checkbox";

import { useRegisterUser } from "desktop/app/queries/authentication.graphql";

const SignupPage: FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [isFormValid, setFormValid] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [registerUser] = useRegisterUser();

  return (
    <div className="px-3">
      <div className="container mx-auto max-w-md">
        <h1 className="text-white text-2xl">
          You’re in! We just need a few details...
        </h1>
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
          onSubmit={async (event) => {
            event.preventDefault();
            const formData = new FormData(formRef.current!!);
            const formDataObj = Object.fromEntries(formData.entries());
            const { email, password } = formDataObj;
            setLoading(true);

            /*const { data } = await registerUser({
              variables: {
                user: {
                  email,
                  password,
                },
              },
            });

            if (data && data.register) {*/
            signIn<RedirectableProviderType>("credentials", {
              email,
              password,
              redirect: false,
            }).then(async (response) => {
              setLoading(false);
              if (response?.ok) {
                await router.replace("/");
              } else {
                setError("Your email and/or password are incorrect.");
              }
            });
            //}
          }}
        >
          <div className="mt-9">
            <Label for="first-name">First name</Label>
            <Input
              id="first-name"
              type="text"
              name="first-name"
              autocomplete="first-name"
              required
            />
          </div>
          <div className="mt-4">
            <Label for="last-name">Last name</Label>
            <Input
              id="last-name"
              type="text"
              name="last-name"
              autocomplete="last-name"
              required
            />
          </div>
          <div className="mt-4">
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
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </a>
            </div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              autocomplete="current-password"
              required
            />
          </div>
          <div className="mt-4">
            <div className="flex flex-row justify-between">
              <Label for="confirm_password">Confirm password</Label>
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
          <div className="mt-6 flex flex-row items-center justify-between">
            <div className="flex flex-row">
              <Checkbox
                id="terms-check"
                name="terms-check"
                className="flex-shrink-0 mt-1"
              />
              <Label for="terms-check" className="font-medium ml-2">
                <span>I agree to the Prometheus Alts</span>
                <a href="/terms" className="text-primary text-sm">
                  {" "}
                  Terms
                </a>
                ,
                <a href="/community" className="text-primary text-sm">
                  {" "}
                  Community{" "}
                </a>
                and
                <a href="/privacy" className="text-primary text-sm">
                  {" "}
                  Privacy Policy
                </a>
              </Label>
            </div>
            <div className="flex-shrink-0">
              <Button
                type="submit"
                variant="gradient-primary"
                className="w-full uppercase leading-6"
                disabled={!isFormValid}
                loading={loading}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </form>
      </div>
      <div className="mt-12 text-center text-white">OR, SIGN UP WITH</div>
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

export default SignupPage;

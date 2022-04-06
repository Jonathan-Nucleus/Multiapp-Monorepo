import { FC, useState } from "react";
import Input from "../../common/Input";
import Label from "../../common/Label";
import Button from "../../common/Button";
import AppleIcon from "shared/assets/images/apple.svg";
import GoogleIcon from "shared/assets/images/google.svg";
import LinkedInIcon from "shared/assets/images/linkedin.svg";
import WarningIcon from "shared/assets/images/warning-red.svg";
import Image from "next/image";
import Alert from "../../common/Alert";
import Checkbox from "../../common/Checkbox";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  crsCheck: boolean;
};

const schema = yup
  .object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email("Must be a valid email").required(),
    phoneNumber: yup.string().required(),
    password: yup.string().min(8).required(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Confirm password mismatch")
      .required(),
    acceptTerms: yup.boolean().oneOf([true]).required(),
    crsCheck: yup.boolean().oneOf([true]).required(),
  })
  .required();

const SignupPage: FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
      <div className="container mx-auto max-w-xl">
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-9">
            <Label htmlFor="first-name">First Name</Label>
            <Input
              id="first-name"
              autoComplete="first-name"
              {...register("firstName")}
            />
          </div>
          <div className="mt-4">
            <Label htmlFor="last-name">Last Name</Label>
            <Input
              id="last-name"
              autoComplete="last-name"
              {...register("lastName")}
            />
          </div>
          <div className="mt-4">
            <Label htmlFor="email">Email</Label>
            <Input id="email" autoComplete="email" {...register("email")} />
          </div>
          <div className="mt-4">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              autoComplete="phone"
              {...register("phoneNumber")}
            />
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
          <div className="mt-4">
            <div className="flex flex-row justify-between">
              <Label htmlFor="confirm_password">Confirm Password</Label>
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
          <div className="flex flex-row items-center mt-6">
            <Checkbox
              id="terms-check"
              className="flex-shrink-0"
              {...register("acceptTerms")}
            />
            <Label htmlFor="terms-check" className="font-medium ml-2">
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
          <div className="flex flex-row items-center mt-5">
            <Checkbox
              id="form-crs-check"
              className="flex-shrink-0"
              {...register("crsCheck")}
            />
            <Label htmlFor="form-crs-check" className="font-medium ml-2">
              I also hereby acknowledge the receipt of
              <Link href="/form-crs">
                <a className="text-primary"> Prometheus’s Form CRS</a>
              </Link>
              .
            </Label>
          </div>
          <div className="text-right mt-7">
            <Button
              type="submit"
              variant="gradient-primary"
              className="w-full md:w-48 uppercase leading-6"
              disabled={!isValid}
              loading={loading}
            >
              Sign Up
            </Button>
          </div>
        </form>
      </div>
      <div className="mt-12 text-center text-white">OR, SIGN UP WITH</div>
      <div className="container mx-auto mt-8 pb-8 max-w-lg">
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

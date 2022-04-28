import { FC, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { signIn } from "next-auth/react";
import * as yup from "yup";
import "yup-phone";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";

import Field from "../../common/Field";
import Input from "../../common/Input";
import Button from "../../common/Button";
import Label from "../../common/Label";
import ErrorMessage from "../../common/ErrorMessage";
import Alert from "../../common/Alert";
import Checkbox from "../../common/Checkbox";

import { PASSWORD_PATTERN } from "shared/src/patterns";
import { useRegisterUser } from "desktop/app/queries/authentication.graphql";
import { AppleLogo, GoogleLogo, LinkedinLogo, WarningCircle } from "phosphor-react";

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
    firstName: yup.string().required("Required"),
    lastName: yup.string().required("Required"),
    email: yup.string().email("Must be a valid email").required("Required"),
    phoneNumber: yup
      .string()
      .phone(undefined, false, "Oops, looks like an invalid phone number")
      .required("Required"),
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
    acceptTerms: yup
      .boolean()
      .oneOf([true], "You must accept the terms and conditions")
      .required(),
    crsCheck: yup
      .boolean()
      .oneOf([true], "You must acknowledge receipt Form CRS")
      .required(),
  })
  .required();

const SignupPage: FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registerUser] = useRegisterUser();
  const { register, handleSubmit, formState } = useForm<
    yup.InferType<typeof schema>
  >({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const { dirtyFields, errors } = formState;
  const isValid =
    Object.keys(dirtyFields).length === Object.keys(schema.fields).length &&
    Object.keys(errors).length === 0;
  const { code } = router.query as Record<string, string>;
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const {
      firstName,
      lastName,
      acceptTerms,
      crsCheck,
      email,
      password,
      phoneNumber,
    } = values;

    setLoading(true);
    const result = await registerUser({
      variables: {
        user: {
          email,
          firstName,
          lastName,
          password,
          inviteCode: code,
        },
      },
    });

    if (result.data?.register) {
      signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      }).then(async () => {
        await router.replace("/");
      });
    } else {
      setError(
        "Uh oh, looks like a different email address than we have on record"
      );
      setLoading(false);
    }
  };

  return (
    <div className="px-3">
      <div className="container mx-auto max-w-xl">
        <h1 className="text-white text-2xl">
          You’re in! We just need a few details...
        </h1>
        <div className="my-6 mb-9">
          <div className={error ? "block" : "hidden"}>
            <Alert variant="error">
              <div className="flex flex-row">
                <div className="flex-shrink-0 text-error">
                  <WarningCircle color="currentColor" size={24} weight="bold" />
                </div>
                <div className="text-white ml-3">{error}</div>
              </div>
            </Alert>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Field
            register={register}
            state={formState}
            name="firstName"
            label="First Name"
            autoComplete="firstName"
          />
          <Field
            register={register}
            state={formState}
            name="lastName"
            label="Last Name"
            autoComplete="lastName"
          />
          <Field
            register={register}
            state={formState}
            name="email"
            label="Email"
            autoComplete="email"
          />
          <Field
            register={register}
            state={formState}
            name="phoneNumber"
            label="Phone Number"
            autoComplete="phone"
          />
          <div className="mt-4">
            <div className="flex flex-row justify-between">
              <Label htmlFor="password" name="password" errors={errors}>
                Password
              </Label>
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
            <ErrorMessage name="password" errors={errors} />
          </div>
          <div className="mt-4">
            <div className="flex flex-row justify-between">
              <Label
                htmlFor="confirm_password"
                name="confirmPassword"
                errors={errors}
              >
                Confirm Password
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
          <div className="mt-6">
            <div className="flex flex-row items-center">
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
            <ErrorMessage name="acceptTerms" errors={errors} className="ml-6" />
          </div>
          <div className="mt-5">
            <div className="flex flex-row items-center">
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
            <ErrorMessage name="crsCheck" errors={errors} className="ml-6" />
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
            <AppleLogo color="white" weight="fill" size={20} />
            <span className="ml-2 hidden md:inline-block">APPLE</span>
          </Button>
          <Button
            variant="outline-primary"
            className="w-12 h-12 md:w-full md:h-auto rounded-lg md:rounded-full border border-gray-400 md:border-primary"
          >
            <GoogleLogo color="white" weight="bold" size={20} />
            <span className="ml-2 hidden md:inline-block">GOOGLE</span>
          </Button>
          <Button
            variant="outline-primary"
            className="w-12 h-12 md:w-full md:h-auto rounded-lg md:rounded-full border border-gray-400 md:border-primary"
          >
            <LinkedinLogo color="white" weight="fill" size={20} />
            <span className="ml-2 hidden md:inline-block">LINKEDIN</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

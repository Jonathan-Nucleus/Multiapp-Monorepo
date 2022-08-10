import { FC, Fragment, useState } from "react";
import Image from "next/image";
import LogoWithText from "shared/assets/images/logo-gradient.svg";
import Label from "../../../common/Label";
import Input from "../../../common/Input";
import { PASSWORD_PATTERN, passwordRequirements } from "shared/src/patterns";
import { CheckCircle, Circle } from "phosphor-react";
import Button from "../../../common/Button";
import Link from "next/link";
import { CONTACT_EMAIL } from "../../InviteCodePage";
import { DefaultValues, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Apple from "shared/assets/images/apple.svg";
import Google from "shared/assets/images/google.svg";
import LinkedIn from "shared/assets/images/linkedin.svg";
import { Transition } from "@headlessui/react";

const PROVIDER_ICONS: Record<string, string> = {
  apple: Apple,
  google: Google,
  linkedin: LinkedIn,
};

export type FormValues = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

const schema = yup
  .object({
    email: yup.string().email("Must be a valid email").required("Required"),
    firstName: yup.string().required("Required"),
    lastName: yup.string().required("Required"),
    password: yup
      .string()
      .matches(PASSWORD_PATTERN, "Invalid Password")
      .required("Required"),
  })
  .required();

interface SignupFormProps {
  show: boolean;
  ssoProviders: string[];
  defaultValues?: FormValues;
  onSubmit: (formData: FormValues) => void;
  onSocialSign?: (provider: string) => void;
}

const SignupForm: FC<SignupFormProps> = ({
  show,
  ssoProviders,
  defaultValues,
  onSubmit,
  onSocialSign,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid, errors },
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: schema.cast(defaultValues) as DefaultValues<FormValues>,
  });
  const passwordField = watch("password");
  return (
    <>
      <Transition appear={true} show={show}>
        <div className="h-screen flex flex-col">
          <div className="text-center py-20">
            <Image src={LogoWithText} alt="" width={238} height={42} />
          </div>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="flex-grow min-h-0 flex flex-col">
              <form
                className="flex-grow min-h-0 mt-6"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="mt-6">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    autoComplete="email"
                    className="bg-transparent h-12 !rounded-2xl !text-white font-bold border-gray-600 mt-3 !px-4"
                    isInvalid={!!errors.email}
                    {...register("email")}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-3 mt-6">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      isInvalid={!!errors.firstName}
                      className="bg-transparent h-12 !rounded-2xl !text-white font-bold border-gray-600 mt-3 !px-4"
                      {...register("firstName")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      isInvalid={!!errors.lastName}
                      className="bg-transparent h-12 !rounded-2xl !text-white font-bold border-gray-600 mt-3 !px-4"
                      {...register("lastName")}
                    />
                  </div>
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
                  <div className="flex items-center relative mt-3">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className="bg-transparent h-12 !rounded-2xl !text-white border-gray-600 !pl-4 !pr-10"
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
                      <div className="text-sm text-white/[.87] ml-2">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Button
                    type="submit"
                    variant="gradient-primary"
                    className="w-full h-12 text-sm font-medium tracking-normal"
                    disabled={!isValid}
                  >
                    Next
                  </Button>
                </div>
              </form>
              <div className="text-sm text-white text-center font-medium mb-12">
                <div>
                  Having problems registering?
                  <Link href={`mailto:${CONTACT_EMAIL}`}>
                    <a className="text-primary ml-2">Click here</a>
                  </Link>
                </div>
                <div>and a human will get back to you.</div>
              </div>
              {ssoProviders.length > 0 && (
                <div className="container max-w-xl mx-auto mt-12">
                  <div className="flex items-center justify-center w-full">
                    <div className="bg-brand-overlay/[.1] h-px flex-1"></div>
                    <div className="text-center text-white mx-4">
                      Or, Sign Up with
                    </div>
                    <div className="bg-brand-overlay/[.1] h-px flex-1"></div>
                  </div>
                  <div className="flex items-center justify-center mt-8">
                    {ssoProviders.map((provider) => (
                      <Button
                        key={provider}
                        variant="outline-primary"
                        className="w-12 h-12 md:w-40 md:h-auto rounded-lg md:rounded-full border border-white/[.12] md:border-primary mx-4 px-0 py-0 md:py-2"
                        onClick={() => onSocialSign?.(provider)}
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
          </Transition.Child>
        </div>
      </Transition>
    </>
  );
};

export default SignupForm;

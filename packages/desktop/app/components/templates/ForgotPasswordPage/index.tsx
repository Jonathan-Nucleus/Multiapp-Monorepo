import { FC, useState } from "react";
import Button from "../../common/Button";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRequestPasswordReset } from "shared/graphql/mutation/auth/useRequestPasswordReset";
import Image from "next/image";
import LogoWithText from "shared/assets/images/logo-gradient.svg";
import Label from "../../common/Label";
import Input from "../../common/Input";
import Link from "next/link";
import { toast } from "../../common/Toast";
import { CheckCircle } from "phosphor-react";

type FormValues = {
  email: string;
};

const schema = yup
  .object({
    email: yup.string().email("Must be a valid email").required("Required"),
  })
  .required();

const ForgotPasswordPage: FC = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState<string>();
  const [requestReset] = useRequestPasswordReset();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const onSubmit: SubmitHandler<FormValues> = async ({ email }) => {
    setLoading(true);
    const { data } = await requestReset({ variables: { email } });
    if (data?.requestPasswordReset) {
      setEmailSent(email);
    } else {
      toast.error(
        "Looks like that account doesn't exist. Head to back to our login page to register."
      );
    }
    setLoading(false);
  };
  return (
    <div className="h-screen">
      <div className="text-center py-20">
        <Image src={LogoWithText} alt="" width={238} height={42} />
      </div>
      {emailSent ? (
        <>
          <div className="bg-success text-white text-sm font-medium flex items-center rounded-xl mt-8 p-4">
            <div>
              <CheckCircle color="currentColor" size={24} weight="bold" />
            </div>
            <div className="ml-3">
              <span className="font-bold">{emailSent}</span>
              has been sent an email containing a lnk to reset your password.
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href="/login">
              <a>
                <Button
                  type="button"
                  variant="gradient-primary"
                  className="w-full h-12 text-sm font-medium tracking-normal"
                >
                  Go back to login
                </Button>
              </a>
            </Link>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-xl font-medium mt-4">Forgot your password?</h1>
          <div className="text-sm text-white/[.87] mt-2">
            Enter your email below and we’ll send you a link to reset your
            password.
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
            <div className="mt-8">
              <Button
                type="submit"
                variant="gradient-primary"
                className="w-full text-sm font-medium h-12 tracking-normal"
                disabled={!isValid}
                loading={loading}
              >
                Send Email
              </Button>
            </div>
            <div className="text-center mt-10">
              <Link href="/login">
                <a>
                  <Button
                    type="button"
                    variant="text"
                    className="text-sm text-primary font-medium tracking-normal"
                  >
                    Go back to login
                  </Button>
                </a>
              </Link>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ForgotPasswordPage;

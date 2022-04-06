import { FC, useState } from "react";
import Button from "../../common/Button";
import ArrowLeft from "shared/assets/images/arrow-left.svg";
import Image from "next/image";
import Alert from "../../common/Alert";
import Label from "../../common/Label";
import Input from "../../common/Input";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AppAuthOptions from "../../../config/auth";
import { useRouter } from "next/router";

type FormValues = {
  email: string;
};

const schema = yup
  .object({ email: yup.string().email("Must be a valid email").required() })
  .required();

const ForgotPasswordPage: FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
        <Button
          variant="text"
          onClick={() => router.replace(AppAuthOptions.pages?.signIn!!)}
        >
          <Image src={ArrowLeft} alt="" />
          <span className="font-medium text-primary uppercase ml-3">
            Back to login
          </span>
        </Button>
        <h1 className="text-white text-2xl mt-6">Reset Password</h1>
        <Alert variant="info" className="mt-6 text-white text-sm">
          Enter your email below and we’ll send you a link to reset your
          password.
        </Alert>
        <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" autoComplete="email" {...register("email")} />
          </div>
          <div className="text-right mt-8">
            <Button
              variant="gradient-primary"
              className="w-full md:w-48"
              disabled={!isValid}
              loading={loading}
            >
              SEND EMAIL
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

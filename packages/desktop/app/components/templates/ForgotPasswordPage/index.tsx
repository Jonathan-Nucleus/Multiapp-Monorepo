import { FC, useState } from "react";
import Button from "../../common/Button";
import Alert from "../../common/Alert";
import Field from "../../common/Field";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AppAuthOptions from "../../../config/auth";
import { useRouter } from "next/router";
import { useRequestReset } from "desktop/app/queries/authentication.graphql";
import { ArrowLeft } from "phosphor-react";

type FormValues = {
  email: string;
};

const schema = yup
  .object({
    email: yup.string().email("Must be a valid email").required("Required"),
  })
  .required();

const ForgotPasswordPage: FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    variant: "info" | "success" | "error";
  }>({
    message:
      "Enter your email below and we’ll send you a link to reset your password.",
    variant: "info",
  });
  const [requestReset] = useRequestReset();
  const { register, handleSubmit, formState } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const { isValid } = formState;
  const onSubmit: SubmitHandler<FormValues> = async ({ email }) => {
    setLoading(true);
    const { data } = await requestReset({ variables: { email } });
    setAlert(
      data?.requestPasswordReset
        ? {
          message: `We sent an email to ${email} with a link to reset your password`,
          variant: "success",
        }
        : {
          message: `Looks like that account doesn't exist. Head to back to our login page to register.`,
          variant: "error",
        },
    );
    setLoading(false);
  };
  return (
    <div className="px-3">
      <div className="container mx-auto max-w-xl">
        <Button
          variant="text"
          className="text-primary font-medium text-primary"
          onClick={() => router.replace(AppAuthOptions.pages?.signIn!!)}
        >
          <ArrowLeft size={32} weight="light" color="currentColor" />
          <span className="ml-3">
            Back to Login
          </span>
        </Button>
        <h1 className="text-white text-2xl mt-6">Reset Password</h1>
        <Alert variant={alert.variant} className="mt-6 text-white text-sm">
          {alert.message}
        </Alert>
        {alert.variant !== "success" && (
          <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
            <Field
              label="Email"
              name="email"
              register={register}
              state={formState}
            />
            <div className="text-right mt-8">
              <Button
                variant="gradient-primary"
                className="w-full md:w-48"
                disabled={!isValid}
                loading={loading}
              >
                Send Email
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

import { FC, useState } from "react";
import { useRouter } from "next/router";
import Button from "../../common/Button";
import Label from "../../common/Label";
import Input from "../../common/Input";
import Field from "../../common/Field";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";

import { useVerifyInvite } from "desktop/app/queries/authentication.graphql";

type FormValues = { code: string };
const schema = yup
  .object({ code: yup.string().required("Required") })
  .required();

const InviteCodePage: FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [verifyInvite] = useVerifyInvite();
  const { register, handleSubmit, setError, formState } = useForm<
    yup.InferType<typeof schema>
  >({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    setLoading(true);

    const code = formData.code.trim();
    const { data } = await verifyInvite({ variables: { code } });
    data?.verifyInvite
      ? router.push(`/signup/${code}`)
      : setError("code", {
          message:
            "Sorry, that code was invalid. Try again or request another code.",
        });

    setLoading(false);
  };

  return (
    <div className="px-3">
      <div className="container mx-auto max-w-xl">
        <h1 className="text-white text-2xl mt-6">Join the inner circle!</h1>
        <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
          <Field
            register={register}
            state={formState}
            name="code"
            label="Enter code"
          />
          <div className="text-right mt-8">
            <Button
              type="submit"
              variant="gradient-primary"
              className="px-6 w-full md:w-auto"
            >
              Next
            </Button>
          </div>
        </form>
        <div className="text-center mt-12 text-white">OR, LOG IN WITH</div>
        <div className="text-center mt-4">
          <Button
            variant="text"
            className="uppercase text-primary"
            loading={loading}
          >
            request an invite
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InviteCodePage;

import { FC, useState } from "react";
import { useRouter } from "next/router";
import Button from "../../common/Button";
import Field from "../../common/Field";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useVerifyInviteLazy } from "shared/graphql/query/auth/useVerifyInvite";
import Link from "next/link";

type FormValues = { code: string };
const schema = yup
  .object({ code: yup.string().required("Required") })
  .required();

const InviteCodePage: FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [verifyInvite] = useVerifyInviteLazy();
  const { register, handleSubmit, setError, formState } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    setLoading(true);
    const code = formData.code.trim();
    try {
      const { data } = await verifyInvite({ variables: { code } });
      data?.verifyInvite
        ? await router.push(`/signup?code=${code}`)
        : setError("code", {
          message:
            "Sorry, that code was invalid. Try again or request another code.",
        });
    } catch (e) {
      setError("code", { message: "Failed with error" });
    }
    setLoading(false);
  };

  return (
    <div className="px-3">
      <div className="container mx-auto max-w-xl">
        <h1 className="text-white text-2xl mt-6">Join the inner circle!</h1>
        <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="sm:h-20">
            <Field
              register={register}
              state={formState}
              name="code"
              label="Enter code"
            />
          </div>
          <div className="text-right mt-4">
            <Button
              type="submit"
              variant="gradient-primary"
              className="px-6 w-full md:w-24"
              disabled={loading}
              loading={loading}
            >
              Next
            </Button>
          </div>
        </form>
        <div className="mt-12">
          <div className="flex items-center justify-center w-full">
            <div className="bg-brand-overlay/[.1] h-px flex-1"></div>
            <div className="text-center text-white mx-4">Or</div>
            <div className="bg-brand-overlay/[.1] h-px flex-1"></div>
          </div>
          <div className="text-center mt-4">
            <Link href="https://prometheusalts.com/#invite-form">
              <a>
                <Button
                  variant="text"
                  className="text-primary"
                  disabled={loading}
                >
                  Request an Invite
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteCodePage;

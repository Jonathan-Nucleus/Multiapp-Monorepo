import { FC, useState } from "react";
import { useRouter } from "next/router";
import Button from "../../common/Button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useVerifyInviteLazy } from "shared/graphql/query/auth/useVerifyInvite";
import Link from "next/link";
import Image from "next/image";
import LogoWithText from "shared/assets/images/logo-gradient.svg";
import Label from "../../common/Label";
import Input from "../../common/Input";
import { toast } from "../../common/Toast";

type FormValues = { code: string };
const schema = yup
  .object({ code: yup.string().required("Required") })
  .required();

export const CONTACT_EMAIL = "clientservices@prometheusalts.com";

const InviteCodePage: FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [verifyInvite] = useVerifyInviteLazy();
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    setLoading(true);
    const code = formData.code.trim();
    const { data } = await verifyInvite({ variables: { code } });
    if (data?.verifyInvite) {
      await router.push(`/signup?code=${code}`);
    } else {
      toast.error("Invalid code.");
    }
    setLoading(false);
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-grow min-h-0">
        <div className="text-center py-20">
          <Image src={LogoWithText} alt="" width={238} height={42} />
        </div>
        <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
          <Label htmlFor="code" className="text-sm text-white font-medium">
            Enter Code
          </Label>
          <Input
            id="code"
            className="bg-transparent border border-gray-600 text-2xl !text-white font-bold h-12 !rounded-2xl mt-3 !px-4"
            {...register("code")}
          />
          <div className="mt-8">
            <Button
              type="submit"
              variant="gradient-primary"
              className="w-full h-12 font-medium tracking-normal"
              disabled={!isValid}
              loading={loading}
            >
              Next
            </Button>
          </div>
        </form>
        <div className="text-sm text-white text-center font-medium mt-12">
          Having problems registering?
          <Link href={`mailto:${CONTACT_EMAIL}`}>
            <a className="text-primary ml-2">Click Here</a>
          </Link>
          <div>and a human will get back to you.</div>
        </div>
        <div className="mt-8">
          <div className="text-tiny text-white text-center">OR</div>
          <div className="text-center mt-4">
            <Link href="/request-code">
              <a>
                <Button
                  variant="text"
                  className="text-primary font-medium tracking-wide uppercase"
                  disabled={loading}
                >
                  Request an Invite
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </div>
      <div className="text-center mb-20">
        <Link href="/login">
          <a>
            <Button
              variant="text"
              className="text-sm text-primary font-medium tracking-normal mt-4"
            >
              I already have an account.
            </Button>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default InviteCodePage;

import { FC, useState } from "react";
import Button from "../../common/Button";
import Label from "../../common/Label";
import Input from "../../common/Input";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";

type FormValues = { code: string };
const schema = yup.object({ code: yup.string().required() }).required();

const InviteCodePage: FC = () => {
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
        <h1 className="text-white text-2xl mt-6">Join the inner circle!</h1>
        <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="code">Enter code</Label>
            <Input id="code" {...register("code")} />
          </div>
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
        <div className="text-center mt-12 text-white">OR</div>
        <div className="text-center mt-4">
          <Button
            variant="text"
            className="uppercase text-primary"
            disabled={!isValid}
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

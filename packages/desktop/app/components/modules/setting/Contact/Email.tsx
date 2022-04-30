import React, { ChangeEvent, FC, useMemo, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";

import Button from "../../../common/Button";
import Field from "../../../common/Field";

const FUND = [
  { label: "Manager", value: "manager" },
  { label: "Good Soil LP Fund with really long n", value: "journalist" },
  { label: "Millenium Capital Diversified LP adve  ", value: "cManager" },
  { label: "Big Man’s LP Fund for Winners", value: "founder" },
  { label: "Geoff & Partners LP Fund for Playas", value: "exManager" },
  { label: "Any Fund", value: "other" },
];

type FormValues = {
  fund: string;
  comment: string;
};

const schema = yup.object({
  fund: yup.string().default("").required("Required"),
  comment: yup.string().default("").required("Required"),
});

interface ContactEmailProps {
  setSuccess: () => void;
}

const ContactEmail: FC<ContactEmailProps> = ({
  setSuccess,
}: ContactEmailProps) => {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState } = useForm<
    yup.InferType<typeof schema>
  >({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const { isValid } = formState;

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      setLoading(true);
    } catch (err) {
      console.log("err", err);
    } finally {
      setSuccess();
    }
  };

  return (
    <div className="h-[340px] overflow-y-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="px-4">
          <Field
            register={register}
            state={formState}
            name="fund"
            label="Fund of Interest"
            autoComplete="fund"
            selectBox
            options={FUND}
          />
          <Field
            register={register}
            state={formState}
            name="comment"
            label="Comment"
            autoComplete="comment"
            textareaClassName="block w-full bg-white rounded-lg text-sm text-black p-2"
            rows={5}
            textarea
          />
        </div>
        <div className="flex justify-end border-t p-4 border-brand-overlay/[.1]">
          <Button
            type="submit"
            variant="gradient-primary"
            className="w-full md:w-48 uppercase leading-6"
            disabled={!isValid}
            loading={loading}
          >
            CONTINUE
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactEmail;

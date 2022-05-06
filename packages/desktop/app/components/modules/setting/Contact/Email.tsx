import React, { ChangeEvent, FC, useMemo, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";

import Button from "../../../common/Button";
import Field from "../../../common/Field";
import { ProRoleOptions } from "backend/schemas/user";

interface Fund {
  value: string;
  label: string;
}

interface ContactEmailProps {
  handleContact: (request: HelpRequestVariables) => void;
  FUNDS: Fund[];
}

interface FormValues {
  fund: string;
  comment: string;
  email: string;
}

const schema = yup.object({
  fund: yup.string().default("").required("Required"),
  comment: yup.string().default("").required("Required"),
  email: yup.string().email("Must be a valid email").required("Required"),
});

interface HelpRequestVariables {
  request: {
    type: string;
    email?: string;
    phone?: string;
    fundId: string;
    message: string;
    preferredTimeOfDay?: string;
  };
}

const ContactEmail: FC<ContactEmailProps> = ({
  handleContact,
  FUNDS,
}: ContactEmailProps) => {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState } = useForm<
    yup.InferType<typeof schema>
  >({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const { isValid } = formState;

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    handleContact({
      request: {
        type: "EMAIL",
        email: values.email,
        fundId: values.fund,
        message: values.comment,
      },
    });
  };

  return (
    <div className="h-[340px] overflow-y-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="px-4">
          <Field
            register={register}
            state={formState}
            name="email"
            label="Email Address"
            autoComplete="email"
          />
          <Field
            register={register}
            state={formState}
            name="fund"
            label="Fund of Interest"
            autoComplete="fund"
            selectBox
            options={FUNDS}
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

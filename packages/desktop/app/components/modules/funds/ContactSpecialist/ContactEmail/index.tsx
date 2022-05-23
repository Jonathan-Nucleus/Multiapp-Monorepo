import React, { FC, useState } from "react";
import * as yup from "yup";
import { useHelpRequest } from "shared/graphql/mutation/account";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Fund } from "shared/graphql/query/marketplace/useFunds";
import Field from "../../../../common/Field";
import Button from "../../../../common/Button";
import { ArrowLeft } from "phosphor-react";

type FormValues = {
  email: string;
  fund: string;
  message: string;
};

const schema = yup
  .object({
    email: yup.string().email("Must be a valid email").required("Required"),
    fund: yup.string().default("").required("Required"),
    message: yup.string().default("").required("Required"),
  })
  .required();

interface ContactEmailProps {
  funds: Fund[];
  onComplete: () => void;
  onBack: () => void;
}

const ContactEmail: FC<ContactEmailProps> = ({ funds, onComplete, onBack }) => {
  const [helpRequestCallback] = useHelpRequest();
  const [loading, setLoading] = useState(false);
  const { register, formState, handleSubmit } = useForm<
    yup.InferType<typeof schema>
  >({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const isValid = formState.isValid;
  const fundOptions = funds.map((fund) => {
    return {
      label: fund.name,
      value: fund._id,
    };
  });
  const onSubmit: SubmitHandler<FormValues> = async ({
    email,
    fund,
    message,
  }) => {
    setLoading(true);
    try {
      await helpRequestCallback({
        variables: {
          request: {
            type: "EMAIL",
            email,
            fundId: fund,
            message,
          },
        },
      });
      onComplete();
    } catch (e) {}
    setLoading(true);
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="px-5 py-5">
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
            options={fundOptions}
          />
          <Field
            register={register}
            state={formState}
            name="message"
            label="Comment"
            autoComplete="comment"
            textareaClassName="block w-full bg-white rounded-lg text-sm text-black p-2"
            rows={5}
            textarea
          />
        </div>
        <div className="flex items-center justify-between border-t border-white/[.12] px-5 py-4">
          <Button
            type="button"
            variant="text"
            disabled={loading}
            className="text-primary"
            onClick={onBack}
          >
            <ArrowLeft color="currentColor" size={24} weight="bold" />
            <div className="ml-1">Back</div>
          </Button>
          <Button
            type="submit"
            variant="outline-primary"
            className="w-28 text-white"
            disabled={!isValid}
            loading={loading}
          >
            Continue
          </Button>
        </div>
      </form>
    </>
  );
};

export default ContactEmail;

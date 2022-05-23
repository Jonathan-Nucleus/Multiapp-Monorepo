import React, { FC, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import "yup-phone";
import { yupResolver } from "@hookform/resolvers/yup";
import Field from "../../../../common/Field";
import Button from "../../../../common/Button";
import { Fund } from "shared/graphql/query/marketplace/useFunds";
import { useHelpRequest } from "shared/graphql/mutation/account";
import { ArrowLeft } from "phosphor-react";
import { PreferredTimeOfDayOptions } from "backend/schemas/help-request";

export const TimeOptions = Object.keys(PreferredTimeOfDayOptions).map((key) => {
  return {
    value: key,
    label: PreferredTimeOfDayOptions[key].label,
  };
});
export const TimezoneOptions = [
  { label: "EST", value: "est" },
  { label: "PST", value: "pst" },
  { label: "CST", value: "cst" },
];

type FormValues = {
  phone: string;
  time: string;
  timezone: string;
  fund: string;
  message: string;
};

const schema = yup
  .object({
    phone: yup
      .string()
      .phone(undefined, false, "Oops, looks like an invalid phone number")
      .required("Required"),
    time: yup.string().default("").required("Required"),
    timezone: yup.string().default("").required("Required"),
    fund: yup.string().default("").required("Required"),
    message: yup.string().default("").required("Required"),
  })
  .required();

interface ContactPhoneProps {
  funds: Fund[];
  onComplete: () => void;
  onBack: () => void;
}

const ContactPhone: FC<ContactPhoneProps> = ({ funds, onComplete, onBack }) => {
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
    phone,
    time,
    fund,
    message,
  }) => {
    setLoading(true);
    try {
      await helpRequestCallback({
        variables: {
          request: {
            type: "PHONE",
            phone,
            preferredTimeOfDay: time,
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
        <div className="px-5">
          <Field
            name="phone"
            label="Phone Number"
            autoComplete="phoneNumber"
            placeholder="(908) 123-4567"
            register={register}
            state={formState}
          />
          <div className="flex-grow md:grid grid-cols-2 gap-6">
            <Field
              register={register}
              state={formState}
              name="time"
              label="Best Time to be Contacted"
              autoComplete="time"
              selectBox
              options={TimeOptions}
            />
            <Field
              register={register}
              state={formState}
              name="timezone"
              label="Preferred Time Zone"
              autoComplete="timezone"
              selectBox
              options={TimezoneOptions}
            />
          </div>
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

export default ContactPhone;

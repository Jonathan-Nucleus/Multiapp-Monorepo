import React, { ChangeEvent, FC, useMemo, useState } from "react";
import * as yup from "yup";
import "yup-phone";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";

import Button from "../../../common/Button";
import Field from "../../../common/Field";

const DAY = [
  { label: "Morning (8am - 12pm)", value: "morning" },
  { label: "Afternoon (12pm - 5pm)", value: "afternoon" },
  { label: "Evening (5pm - 8pm)", value: "evening" },
];

const TIMEZONE = [
  { label: "EST", value: "est" },
  { label: "PST", value: "pst" },
  { label: "CST", value: "cst" },
];

interface Fund {
  value: string;
  label: string;
}
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

interface FormValues {
  phoneNumber: string;
  time: string;
  timezone: string;
  fund: string;
  comment: string;
}

const schema = yup.object({
  phoneNumber: yup
    .string()
    .phone(undefined, false, "Oops, looks like an invalid phone number")
    .required("Required"),
  time: yup.string().default("").required("Required"),
  timezone: yup.string().default("").required("Required"),
  fund: yup.string().default("").required("Required"),
  comment: yup.string().default("").required("Required"),
});

interface ContactPhoneProps {
  handleContact: (request: HelpRequestVariables) => void;
  FUNDS: Fund[];
}

const ContactPhone: FC<ContactPhoneProps> = ({
  handleContact,
  FUNDS,
}: ContactPhoneProps) => {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState } = useForm<
    yup.InferType<typeof schema>
  >({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const { isValid } = formState;

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const { phoneNumber, time, timezone, fund, comment } = values;
    handleContact({
      request: {
        type: "PHONE",
        phone: phoneNumber,
        fundId: fund,
        message: comment,
        preferredTimeOfDay: time,
      },
    });
  };

  return (
    <div className="h-[500px] overflow-y-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="px-4">
          <Field
            register={register}
            state={formState}
            name="phoneNumber"
            label="Phone Number"
            autoComplete="phoneNumber"
            placeholder="(908) 123-4567"
          />
          <div className="flex-grow md:grid grid-cols-2 gap-2">
            <Field
              register={register}
              state={formState}
              name="time"
              label="Best Time to be Contacted"
              autoComplete="time"
              selectBox
              options={DAY}
            />
            <Field
              register={register}
              state={formState}
              name="timezone"
              label="Preferred Time Zone"
              autoComplete="timezone"
              selectBox
              options={TIMEZONE}
            />
          </div>

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

export default ContactPhone;

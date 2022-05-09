import { FC, ReactElement } from "react";
import { CircleWavy, Phone, Envelope } from "phosphor-react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, FieldValues, Control } from "react-hook-form";
import "yup-phone";

import Label from "desktop/app/components/common/Label";
import Field from "desktop/app/components/common/Field";
import ErrorMessage from "desktop/app/components/common/ErrorMessage";
import SegmentedInput from "desktop/app/components/common/SegmentedInput";
import type { WizardStepRenderProps } from "desktop/app/components/common/Wizard";

export type FormData = {
  advisorRequest: {
    firmName: string;
    firmCrd: string;
    phone: string;
    email: string;
    contactMethod: string;
  };
};

export const formSchema = yup
  .object({
    advisorRequest: yup
      .object({
        firmName: yup.string().required("Required").default(""),
        firmCrd: yup.string().required("Required").default(""),
        phone: yup
          .string()
          .phone(undefined, false, "Oops, looks like an invalid phone number")
          .required("Required")
          .default(""),
        email: yup
          .string()
          .email("Must be a valid email")
          .required("Required")
          .default(""),
        contactMethod: yup
          .mixed()
          .oneOf(["PHONE", "EMAIL"])
          .required("Required"),
      })
      .required(),
  })
  .required();

const FAIntake = ({
  register,
  formState,
}: WizardStepRenderProps<FormData>): ReactElement => {
  const { errors } = formState;
  return (
    <div className="mt-4">
      <div className="flex flex-col justify-center border-b border-white/[.12] py-6">
        <div className="text-success relative flex justify-center">
          <CircleWavy
            color="currentColor"
            weight="fill"
            size={100}
            className="self-center"
          />
          <div
            className={`absolute top-0 left-0 w-full h-full flex items-center
            justify-center text-3xl font-bold text-white`}
          >
            FA
          </div>
        </div>
        <h5 className="text-center text-white mt-3 text-xl tracking-wide font-medium mb-2">
          Glad to have you aboard!
        </h5>
        <div className="text-sm text-white leading-5 font-extralight mt-4 mb-2 tracking-widest px-5">
          Please fill in your details so our Wealth Management team can reach
          out to you.
        </div>
      </div>
      <div className="p-5">
        <Field
          register={register}
          state={formState}
          name="advisorRequest.firmName"
          label="Firm Name"
        />
        <Field
          register={register}
          state={formState}
          name="advisorRequest.firmCrd"
          label="Firm CDR #"
        />
        <Field
          register={register}
          state={formState}
          name="advisorRequest.phone"
          label="Phone Number"
        />
        <Field
          register={register}
          state={formState}
          name="advisorRequest.email"
          label="Email Address"
          autoComplete="email"
        />
        <div>
          <Label errors={errors} name="advisorRequest.contactMethod">
            How would you like to be contacted?
          </Label>
          <SegmentedInput
            name={"advisorRequest.contactMethod"}
            className="mt-4 mb-8"
            register={register}
            formState={formState}
            options={[
              {
                title: (
                  <div className="inline-block flex flex-row items-center justify-center">
                    <Phone color="white" size={24} />
                    <span className="ml-2 uppercase">phone</span>
                  </div>
                ),
                value: "PHONE",
              },
              {
                title: (
                  <div className="inline-block flex flex-row items-center justify-center">
                    <Envelope color="white" size={24} />
                    <span className="ml-2 uppercase">email</span>
                  </div>
                ),
                value: "EMAIL",
              },
            ]}
          />
          <ErrorMessage name="advisorRequest.contactMethod" errors={errors} />
        </div>
      </div>
    </div>
  );
};

export default FAIntake;

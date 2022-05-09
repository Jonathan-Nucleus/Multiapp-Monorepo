import { FC, ReactElement } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useController, FieldValues, Control } from "react-hook-form";
import { CircleWavy } from "phosphor-react";

import Checkbox from "desktop/app/components/common/Checkbox";
import Label from "desktop/app/components/common/Label";
import SegmentedInput from "desktop/app/components/common/SegmentedInput";
import type { WizardStepRenderProps } from "desktop/app/components/common/Wizard";

import {
  InvestorClass,
  AdvancedFinancialStatusData,
  FinancialStatus,
  FinancialStatusOptions,
} from "backend/graphql/enumerations.graphql";

export type FormData = {
  individualStatuses: {
    TIER1: "yes" | "no" | null;
    TIER2: "yes" | "no" | null;
  };
  entityStatuses: FinancialStatus[];
};

export const formSchema = yup
  .object({
    individualStatuses: yup.object({
      TIER1: yup
        .mixed()
        .oneOf(["yes", "no", null])
        .nullable()
        .default(null)
        .notRequired(),
      TIER2: yup
        .mixed()
        .oneOf(["yes", "no", null])
        .nullable()
        .default(null)
        .notRequired(),
    }),
    entityStatuses: yup
      .array(yup.mixed().oneOf(FinancialStatusOptions).required())
      .required()
      .default([]),
  })
  .required();

interface AdvancedFinancialStatusProps extends WizardStepRenderProps<FormData> {
  investorClass: Extract<InvestorClass, "INDIVIDUAL" | "ENTITY">;
}

const AdvancedFinancialStatus = ({
  investorClass,
  control,
  getValues,
  formState,
  register,
  saveFormState,
  setValue,
}: AdvancedFinancialStatusProps): ReactElement => {
  return investorClass === "INDIVIDUAL" ? (
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
            AI
          </div>
        </div>
        <h5 className="text-center text-white mt-3 text-xl tracking-wide font-medium mb-2">
          Welcome!
          <br />
          {`You're an Accredited Investor!`}
        </h5>
      </div>
      <div className="pt-5">
        <div className="text-sm text-white leading-5 font-extralight mb-8 tracking-widest px-5">
          Some funds on Prometheus are only available to Qualified Purchasers or
          Qualified Clients. To find out if you qualify, complete the short
          questionnaire below.
        </div>
        {AdvancedFinancialStatusData[investorClass].map((item, index) => {
          return (
            <div key={item.value} className="mb-8 px-5">
              <div className="text-white tracking-wider font-extralight">
                {item.title}
              </div>
              <div className="mt-3">
                <SegmentedInput
                  name={`individualStatuses.${item.value}` as const}
                  className="w-60"
                  register={register}
                  formState={formState}
                  options={[
                    { title: "Yes", value: "yes" },
                    { title: "No", value: "no" },
                  ]}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <div className="mt-4">
      <div className="text-white font-normal tracking-wider px-4 mb-4">
        Select all that apply:
      </div>
      <div id="accreditation-step2" className="divide-y divide-white/[.13]">
        {AdvancedFinancialStatusData[investorClass].map((item) => (
          <div key={item.value} className="flex items-start py-5 px-4">
            <Checkbox
              {...register("entityStatuses")}
              id={item.value}
              value={item.value}
              className="shrink-0"
            />
            <Label
              htmlFor={item.value}
              className="font-medium ml-3 leading-4 -mt-1"
            >
              <span className="font-semibold tracking-wider">{item.title}</span>
              :{" "}
              <span className="font-extralight leading-5 tracking-wider">
                {item.description}
              </span>
            </Label>
          </div>
        ))}
        <div className="flex items-center py-6 text-primary">
          <Label
            className="leading-4 cursor-pointer"
            onClick={() => {
              setValue("entityStatuses", []);
              saveFormState();
            }}
          >
            <span className="text-primary font-normal px-4">
              None of these apply to me
            </span>
          </Label>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFinancialStatus;

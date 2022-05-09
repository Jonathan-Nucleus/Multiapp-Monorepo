import { FC, ReactElement } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, FieldValues, Control } from "react-hook-form";
import { Buildings, UserCircle, Users } from "phosphor-react";

import Label from "desktop/app/components/common/Label";
import Checkbox from "desktop/app/components/common/Checkbox";
import type { WizardStepRenderProps } from "desktop/app/components/common/Wizard";

import {
  FinancialStatusOptions,
  BaseFinancialStatusData,
  FinancialStatus,
  InvestorClass,
} from "backend/graphql/enumerations.graphql";

export type FormData = {
  baseStatus: FinancialStatus[];
};

export const formSchema = yup
  .object({
    baseStatus: yup
      .array(yup.mixed().oneOf(FinancialStatusOptions).required())
      .required()
      .default([]),
  })
  .required();

interface BaseFinancialStatusProps extends WizardStepRenderProps<FormData> {
  investorClass: Extract<InvestorClass, "INDIVIDUAL" | "ENTITY">;
}

const BaseFinancialStatus = ({
  investorClass,
  register,
  setValue,
  saveFormState,
}: BaseFinancialStatusProps): ReactElement => {
  return (
    <div className="mt-4">
      <div className="text-white font-normal tracking-wider px-4 mb-4">
        Select all that apply:
      </div>
      <div id="accreditation-step2" className="divide-y divide-white/[.13]">
        {BaseFinancialStatusData[investorClass].map((item) => (
          <div key={item.value} className="flex items-start py-5 px-4">
            <Checkbox
              {...register("baseStatus")}
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
              setValue("baseStatus", []);
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

export default BaseFinancialStatus;

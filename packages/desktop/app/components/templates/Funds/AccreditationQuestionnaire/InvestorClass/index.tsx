import { FC, ReactElement } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, useController, FieldValues, Control } from "react-hook-form";
import { Buildings, UserCircle, Users } from "phosphor-react";

import Label from "desktop/app/components/common/Label";
import Radio from "desktop/app/components/common/Radio";
import type { WizardStepRenderProps } from "desktop/app/components/common/Wizard";

import {
  InvestorClassOptions,
  InvestorClass,
} from "backend/graphql/enumerations.graphql";

export type FormData = {
  class: InvestorClass;
};

export const formSchema = yup
  .object({
    class: yup
      .mixed()
      .oneOf(InvestorClassOptions.map((option) => option.value))
      .required(),
  })
  .required();

const ICONS: Record<InvestorClass, React.ReactNode> = {
  INDIVIDUAL: <UserCircle size={24} color="currentColor" />,
  ENTITY: <Buildings size={24} color="currentColor" />,
  ADVISOR: <Users size={24} color="currentColor" />,
};

const InvestorClassForm = ({
  control,
  wizardBag,
  submitStep,
}: WizardStepRenderProps<FormData>): ReactElement => {
  const { field } = useController({
    name: "class",
    control,
  });

  return (
    <div className="px-4 pt-4">
      <div className="text-white">Are you investing as an:</div>
      <div className="mt-3">
        {InvestorClassOptions.map((item) => (
          <div key={item.value} className="flex items-center py-2">
            <div
              onClick={async () => {
                field.onChange(item.value);
                submitStep();
              }}
              className={`font-medium cursor-pointer uppercase rounded-full flex
                items-center px-4 w-full border border-info h-10 hover:bg-info/[.6]
                transition-all tracking-widest text-sm ${
                  field.value === item.value ? "bg-info/[.6]" : "bg-info/[.1]"
                }`}
            >
              <div className="text-white">{ICONS[item.value]}</div>
              <div className="ml-2 text-white">{item.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvestorClassForm;

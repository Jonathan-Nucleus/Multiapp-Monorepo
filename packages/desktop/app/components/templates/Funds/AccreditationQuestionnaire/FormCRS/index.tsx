import { FC } from "react";
import { CircleWavy, ArrowRight } from "phosphor-react";
import * as yup from "yup";

import Button from "desktop/app/components/common/Button";
import { InvestorClass } from "backend/graphql/enumerations.graphql";
import type { WizardStepRenderProps } from "desktop/app/components/common/Wizard";

export type FormData = {
  ackCRS: boolean;
};

export const formSchema = yup
  .object({
    ackCRS: yup.boolean().required().default(false),
  })
  .required();

interface FormCRSProps extends WizardStepRenderProps<FormData> {
  investorClass: InvestorClass;
}

const FormCRS: FC<FormCRSProps> = ({ investorClass, setValue, submitStep }) => {
  const handleAcknowldge = (): void => {
    setValue("ackCRS", true);
    submitStep();
  };

  return (
    <div className="mt-4">
      <div className="text-white font-normal tracking-wider px-6 mb-46">
        Please acknowledge you have reviewed the following forms:
      </div>
      <div
        id="accreditation-step2"
        className="p-6 tracking-wider text-sm text-white/[0.4]"
      >
        <a
          href=""
          className="text-primary"
          target="_blank"
          rel="noreferrer noopener"
        >
          Prometheus Financial Advisors, LLC Form ADV Part 2A
        </a>
        <br />
        <br />
        <a
          href=""
          className="text-primary"
          target="_blank"
          rel="noreferrer noopener"
        >
          Prometheus Financial, LLC Brokerage Form CRS Relationship Summary
        </a>
        <div className="flex justify-center mt-8">
          <Button
            variant="primary"
            className="rounded text-black font-medium"
            onClick={handleAcknowldge}
          >
            I Acknowledge{" "}
            <ArrowRight color="currentColor" size={24} className="ml-2" />
          </Button>
        </div>
        <div className="text-neutral-800 relative flex justify-center mt-8">
          <CircleWavy
            color="currentColor"
            weight="fill"
            size={100}
            className="self-center"
          />
          <div
            className={`absolute top-0 left-0 w-full h-full flex items-center
            justify-center text-3xl font-bold text-white/[0.4]`}
          >
            {investorClass === "ADVISOR" ? "FA" : "AI"}
          </div>
        </div>
        <p className="mt-8 text-white/[0.6]">
          “The Marketplace and investment opportunities offered by Prometheus
          Financial Advisors, LLC, a registered investment advisor (RIA).
          Securities transactions executed by Prometheus Financial, LLC, a
          registered broker-dealer and member FINRA/SIPC. Securities products
          and services offered are private placements only sold to accredited
          investors.
          <br />
          <br />
          By clicking "I Acknowledge" you are acknowledging that you have
          received and reviewed the Prometheus Financial Advisors, LLC Form ADV
          Part 2A (information regarding the RIA) and the Prometheus Financial,
          LLC Brokerage Form CRS Relationship Summary (summarizes the types of
          services the broker dealer provides and what they cost)”
        </p>
      </div>
    </div>
  );
};

export default FormCRS;

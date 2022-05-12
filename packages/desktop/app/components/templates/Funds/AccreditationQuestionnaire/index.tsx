import { FC, useRef, useState } from "react";
import { useRouter } from "next/router";
import { ArrowLeft, ArrowRight } from "phosphor-react";

import ModalDialog from "desktop/app/components/common/ModalDialog";
import Wizard from "desktop/app/components/common/Wizard";
import Button from "desktop/app/components/common/Button";
import AccreditationResult from "./Result";

import { FinancialStatus } from "shared/graphql/mutation/account/useSaveQuestionnaire";

import {
  useSaveQuestionnaire,
  Accreditation,
  InvestorClass as InvestorClassType,
} from "shared/graphql/mutation/account/useSaveQuestionnaire";

import InvestorClass, {
  FormData as InvestorClassData,
  formSchema as investorClassSchema,
} from "./InvestorClass";

import BaseFinancialStatus, {
  FormData as BaseFinancialStatusData,
  formSchema as baseStatusSchema,
} from "./BaseFinancialStatus";

import FAIntake, {
  FormData as FAIntakeData,
  formSchema as faIntakeSchema,
} from "./FAIntake";

import AdvancedFinancialStatus, {
  FormData as AdvancedFinancialStatusData,
  formSchema as advancedStatusSchema,
} from "./AdvancedFinancialStatus";

type FormData = InvestorClassData &
  BaseFinancialStatusData &
  AdvancedFinancialStatusData &
  FAIntakeData;

interface AccreditationQuestionnaireProps {
  show: boolean;
  onClose: () => void;
}

const AccreditationQuestionnaire: FC<AccreditationQuestionnaireProps> = ({
  show,
  onClose,
}) => {
  const router = useRouter();
  const [saveQuestionnaire] = useSaveQuestionnaire();
  const [accreditation, setAccreditation] = useState<Accreditation | undefined>(
    undefined
  );
  const formDataRef = useRef<Partial<FormData>>({});
  const [investorClass, setInvestorClass] = useState<
    InvestorClassType | undefined
  >(undefined);

  const onSubmit = async (values: FormData) => {
    const {
      class: investorClass,
      baseStatus,
      individualStatuses,
      entityStatuses,
      advisorRequest,
    } = values;

    const status = [
      ...baseStatus,
      ...(investorClass === "INDIVIDUAL" && individualStatuses.TIER1 === "yes"
        ? ["TIER1" as FinancialStatus]
        : []),
      ...(investorClass === "INDIVIDUAL" && individualStatuses.TIER2 === "yes"
        ? ["TIER2" as FinancialStatus]
        : []),
      ...(investorClass === "ENTITY" ? entityStatuses : []),
    ];

    const { data } = await saveQuestionnaire({
      variables: {
        questionnaire: {
          class: investorClass,
          status,
          advisorRequest:
            investorClass === "ADVISOR" ? advisorRequest : undefined,
          date: new Date(),
        },
      },
    });

    if (!data?.saveQuestionnaire) {
      console.log("Error submitting questionnaire data");
      return false;
    }

    return () => {
      setAccreditation(data?.saveQuestionnaire.accreditation);
    };
  };

  return (
    <>
      <ModalDialog
        title="Accreditation"
        className="bg-background-card w-[30rem] rounded-lg"
        show={show}
        onClose={onClose}
      >
        {accreditation ? (
          <AccreditationResult
            accreditation={accreditation}
            onClose={() => {
              onClose();
              router.reload();
            }}
          />
        ) : (
          <Wizard<FormData>
            onSubmit={onSubmit}
            currentData={formDataRef}
            wrapper={({
              wizardStep,
              showNavigation,
              bag: {
                stepTitles,
                state: { currentStep, totalSteps },
                helpers,
              },
            }) => (
              <>
                {wizardStep}
                <div
                  className={`flex items-center justify-between p-4 relative min-h-[3rem]
                  ${showNavigation ? "border-t border-white/[.12]" : "mt-4"}`}
                >
                  {showNavigation && (
                    <>
                      <Button
                        type="button"
                        variant="text"
                        className="text-primary font-medium uppercase"
                        onClick={() => {
                          helpers.previous();
                          if (currentStep === 1) {
                            setInvestorClass(undefined); // Reset whenever on this page
                          }
                        }}
                      >
                        <div>
                          <ArrowLeft size={24} color="currentColor" />
                        </div>
                        <div className="ml-1">Back</div>
                      </Button>
                      <Button
                        type="submit"
                        variant="outline-primary"
                        className={`w-40 font-medium border border-info
                          text-white bg-info/[.2] hover:bg-info/[.7] px-3`}
                      >
                        <div className="ml-4 mr-2 flex-1">continue</div>
                        <div>
                          <ArrowRight color="currentColor" size={24} />
                        </div>
                      </Button>
                    </>
                  )}
                  <div
                    className={`absolute bottom-0 top-0 left-0 right-0 flex
                  items-center justify-center pointer-events-none h-100`}
                  >
                    <div className="flex items-center justify-center w-1/3">
                      {[...Array(totalSteps + 1)].map((_, stepIndex) => (
                        <span
                          key={stepIndex}
                          className={`rounded-full mx-1 w-2 h-2 ${
                            currentStep === stepIndex
                              ? "bg-info"
                              : "bg-white/[.38]"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          >
            <Wizard.Step
              stepName="Investor Class"
              schema={investorClassSchema}
              showNavigation={false}
              renderer={(props) => {
                if (investorClass !== undefined) {
                  props.wizardBag.helpers.next();
                }

                return <InvestorClass {...props} />;
              }}
              onNext={async () => {
                setInvestorClass(formDataRef.current.class);
              }}
            />
            {investorClass === "ADVISOR" ? (
              <Wizard.Step
                stepName="FAIntake"
                schema={faIntakeSchema}
                renderer={(props) => <FAIntake {...props} />}
              />
            ) : (
              <Wizard.Step
                stepName="Base Status"
                schema={baseStatusSchema}
                onNext={async (bag) => {
                  if (formDataRef.current.baseStatus?.length === 0) {
                    bag
                      .submitForm()
                      .catch((err) => console.log("err submitting form", err));

                    return false;
                  }
                }}
                renderer={(props) => (
                  <BaseFinancialStatus
                    {...props}
                    investorClass={investorClass ?? "INDIVIDUAL"}
                  />
                )}
              />
            )}
            {investorClass !== "ADVISOR" && (
              <Wizard.Step
                stepName="Advanced Status"
                schema={advancedStatusSchema}
                renderer={(props) => (
                  <AdvancedFinancialStatus
                    {...props}
                    investorClass={investorClass ?? "INDIVIDUAL"}
                  />
                )}
              />
            )}
          </Wizard>
        )}
      </ModalDialog>
    </>
  );
};

export default AccreditationQuestionnaire;

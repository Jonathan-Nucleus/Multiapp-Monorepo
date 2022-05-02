import { ChangeEvent, FC, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Buildings,
  CircleWavy,
  UserCircle,
  Users,
} from "phosphor-react";
import Button from "desktop/app/components/common/Button";
import Label from "desktop/app/components/common/Label";
import Radio from "../../../common/Radio";
import Checkbox from "../../../common/Checkbox";
import ModalDialog from "../../../common/ModalDialog";
import {
  useSaveQuestionnaire,
  FinancialStatus,
  InvestmentLevel,
  InvestorClass,
} from "mobile/src/graphql/mutation/account/useSaveQuestionnaire";
import ButtonToggleGroup from "./ButtonToggleGroup";
import { FinancialStatusOptions, InvestorClassOptions } from "backend/schemas/user";
import { useRouter } from "next/router";

const STEP_COUNT = 4;
const investorOptions = Object.keys(InvestorClassOptions).map((key) => {
  let icon;
  if (key == "INDIVIDUAL") {
    icon = <UserCircle size={24} color="currentColor" />;
  } else if (key == "ENTITY") {
    icon = <Buildings size={24} color="currentColor" />;
  } else if (key == "ADVISOR") {
    icon = <Users size={24} color="currentColor" />;
  }
  return {
    key,
    icon,
    label: InvestorClassOptions[key].label,
  };
});
const financialOptions = Object.keys(FinancialStatusOptions).map((key) => {
  return {
    key,
    title: FinancialStatusOptions[key].title,
    value: FinancialStatusOptions[key].value,
    description: FinancialStatusOptions[key].description,
  };
});

interface AccreditationQuestionnaireProps {
  show: boolean;
  onClose: () => void;
}

const AccreditationQuestionnaire: FC<AccreditationQuestionnaireProps> = ({
  show,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [questionnaireInput, setQuestionnaireInput] = useState<{
    class?: InvestorClass,
    status: FinancialStatus[],
    level?: InvestmentLevel,
  }>({
    class: undefined,
    status: [],
    level: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [saveQuestionnaire] = useSaveQuestionnaire();
  const router = useRouter();
  const onSubmit = async () => {
    if (currentStep == 3) {
      // Submit questionnaire input.
      setLoading(true);
      const { data } = await saveQuestionnaire({
        variables: {
          questionnaire: {
            class: questionnaireInput.class!!,
            status: questionnaireInput.status,
            level: questionnaireInput.level,
            date: new Date(),
          },
        },
      });
      if (data?.saveQuestionnaire._id) {
        setCurrentStep(STEP_COUNT);
      }
      setLoading(false);
    } else if (questionnaireInput.class) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <>
      <ModalDialog
        title="Accreditation"
        className="bg-background-card max-w-lg rounded-lg"
        show={show}
        onClose={onClose}
      >
        <div className="flex flex-col md:flex-row flex-grow md:min-h-0 overflow-y-auto">
          <div className="flex flex-col p-4 md:w-[40rem]">
            {currentStep == 1 && (
              <div id="accreditation-step1">
                <div className="text-white">
                  Are you investing as an:
                </div>
                <div className="mt-3">
                  {investorOptions.map((item, index) => (
                    <div key={index} className="flex items-center py-2">
                      <Radio
                        id={item.key}
                        className="hidden"
                        value={item.key}
                        onChange={() => setQuestionnaireInput({ ...questionnaireInput, class: item.key })}
                      />
                      <Label
                        htmlFor={item.key}
                        className={`font-medium cursor-pointer uppercase rounded-full flex items-center px-4 w-full border border-info h-10 hover:bg-info/[.6] transition-all 
                              ${questionnaireInput.class == item.key ? "bg-info/[.6]" : "bg-info/[.1]"}
                            `}
                      >
                        <div>{item.icon}</div>
                        <div className="ml-2">{item.label}</div>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div id="accreditation-step2">
                <div className="text-white font-medium">
                  Select all that apply:
                </div>
                <div className="mt-3">
                  {financialOptions.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start py-5 border-b border-white/[.13]"
                    >
                      <Checkbox
                        id={item.key}
                        className="shrink-0"
                        checked={questionnaireInput.status.includes(item.key)}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                          const status = questionnaireInput.status;
                          if (event.target.checked) {
                            status.push(item.key);
                          } else {
                            status.splice(status.indexOf(item.key), 1);
                          }
                          setQuestionnaireInput({ ...questionnaireInput, status });
                        }}
                      />
                      <Label
                        htmlFor={item.key}
                        className="font-medium ml-3 leading-4 -mt-1"
                      >
                        <span className="font-semibold tracking-wider">
                          {item.title}
                        </span>
                        :{" "}
                        <span className="font-light leading-5 tracking-wider">
                          {item.description}
                        </span>
                      </Label>
                    </div>
                  ))}
                  <div className="flex items-center py-4 text-primary">
                    <Label
                      className="leading-4 cursor-pointer"
                      onClick={() => setQuestionnaireInput({ ...questionnaireInput, status: [] })}
                    >
                      <span className="text-primary font-normal">
                        None of these apply to me
                      </span>
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div id="accreditation-step3">
                <div className="flex flex-col justify-center border-b border-white/[.12] py-6">
                  <div className="text-success relative flex justify-center">
                    <CircleWavy
                      color="currentColor"
                      weight="fill"
                      size={100}
                      className="self-center"
                    />
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-3xl font-bold text-white">
                      AI
                    </div>
                  </div>
                  <h5 className="text-center text-white mt-3 text-lg tracking-wide font-medium">
                    Welcome!
                    <br />
                    You&apos;re an Accredited Investor!
                  </h5>
                </div>
                <div className="py-4">
                  <div className="text-xs text-white leading-4 font-light mb-8 tracking-widest">
                    Some funds on Prometheus are only available to Qualified
                    Purchasers or Qualified Clients. To find out if you
                    qualify, complete the short questionnaire bellow
                  </div>
                  <div className="mb-8">
                    <div className="text-white tracking-wider font-light">
                      Do you have at least $2.2M in investments?
                    </div>
                    <div className="mt-3">
                      <ButtonToggleGroup
                        value={questionnaireInput.level == "TIER1" || questionnaireInput.level == "TIER2" ? "yes" : "no"}
                        onChange={(value) => {
                          if (value == "no") {
                            setQuestionnaireInput({ ...questionnaireInput, level: undefined });
                          } else if (questionnaireInput.level == undefined) {
                            setQuestionnaireInput({ ...questionnaireInput, level: "TIER1" });
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="text-white tracking-wider font-light">
                      Do you have at least $5M in investments?
                    </div>
                    <div className="mt-3">
                      <ButtonToggleGroup
                        value={questionnaireInput.level == "TIER2" ? "yes" : "no"}
                        onChange={(value) => {
                          if (value == "yes") {
                            setQuestionnaireInput({ ...questionnaireInput, level: "TIER2" });
                          } else if (questionnaireInput.level == "TIER2") {
                            setQuestionnaireInput({ ...questionnaireInput, level: undefined });
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div id="accreditation-step4">
                <div className="flex flex-col justify-center py-6">
                  <div className="text-success relative flex justify-center">
                    <CircleWavy
                      color="currentColor"
                      weight="fill"
                      size={100}
                      className="self-center"
                    />
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-3xl font-bold text-white">
                      QP
                    </div>
                  </div>
                  <h5 className="text-center text-white mt-3 text-lg medium tracking-wide">
                    Awesome!
                    <br />
                    You&apos;re a Qualified Purchaser!
                  </h5>
                </div>
                <div className="pb-4">
                  <div className="text-white text-sm text-center font-light mb-3">
                    Thank you for verifying your qualified purchaser status.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="border-t border-white/[.12] flex items-center justify-between p-4">
          <div className="w-1/3">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="text"
                className="text-primary font-medium uppercase"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                <div><ArrowLeft size={24} color="currentColor" /></div>
                <div className="ml-1">Back</div>
              </Button>
            )}
          </div>
          <div className="flex items-center justify-center w-1/3">
            {[...Array(STEP_COUNT)].map((_, stepIndex) => (
              <span
                key={stepIndex}
                className={`rounded-full mx-1 w-[10px] h-[10px] ${
                  currentStep === stepIndex + 1
                    ? "bg-info"
                    : "bg-white/[.38]"
                }`}
              />
            ))}
          </div>
          <div className="w-1/3 text-right">
            {currentStep != STEP_COUNT ? (
              <Button
                type="button"
                variant="outline-primary"
                className="w-36 border border-info text-white bg-info/[.2] hover:bg-info/[.7] px-5"
                loading={loading}
                onClick={onSubmit}
              >
                <div className="mr-2">continue</div>
                <div><ArrowRight color="currentColor" size={24} /></div>
              </Button>
            ) : (
              <Button
                type="submit"
                variant="outline-primary"
                className="w-36 uppercase border border-info text-white bg-info/[.2] hover:bg-info/[.7]"
                onClick={() => {
                  onClose();
                  router.reload();
                }}
              >
                Close
              </Button>
            )}
          </div>
        </div>
      </ModalDialog>
    </>
  );
};

export default AccreditationQuestionnaire;

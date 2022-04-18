import {
  FC,
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  MouseEventHandler,
} from "react";
import { Dialog } from "@headlessui/react";
import { X, CircleWavy } from "phosphor-react";
import Image from "next/image";
import Card from "desktop/app/components/common/Card";
import Button from "desktop/app/components/common/Button";
import Label from "desktop/app/components/common/Label";
import {
  SubmitHandler,
  useForm,
  Controller,
  DefaultValues,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAccount } from "desktop/app/graphql/queries";
import ArrowLeft from "shared/assets/images/arrow-left.svg";
import ArrowRight from "shared/assets/images/arrow-right.svg";
import AI from "shared/assets/images/ai-large.svg";
import QP from "shared/assets/images/qp-large.svg";
import IndividualIcon from "shared/assets/images/individual.svg";
import EntityIcon from "shared/assets/images/entity.svg";
import AdvisorIcon from "shared/assets/images/advisor.svg";
import Radio from "../../../common/Radio";
import Checkbox from "../../../common/Checkbox";
import ErrorMessage from "../../../common/ErrorMessage";

type FormValues = {
  investAs: string;
  circumstances: string[];
  investment: string[];
};

const schema = yup.object({
  investAs: yup.string().required("Required"),
  circumstances: yup.array().of(yup.string()).notRequired(),
  investment: yup.array().of(yup.string()).notRequired(),
});

interface AccreditationQuestionnaireProps {
  show: boolean;
  onClose: () => void;
}

const STEP_COUNT = 4;

const INVEST_AS = [
  {
    icon: IndividualIcon,
    title: "Individual",
    value: "INDIVIDUAL",
  },
  {
    icon: EntityIcon,
    title: "Entity",
    value: "ENTITY",
  },
  {
    icon: AdvisorIcon,
    title: "Financial Advisor",
    value: "ADVISOR",
  },
];

const CIRCUMSTANCES = [
  {
    title: "Income",
    value: "200K",
    description:
      "I earn $200k+ per year or, with my spousal equivalent, $300K+ per year.",
  },
  {
    title: "Personal Net Worth",
    value: "1M",
    description: "I/we have $1M+ in assets excluding primary residence.",
  },
  {
    title: "License Holder",
    value: "LICENSE",
    description:
      "I hold an active Series 7.65, or 82 licencse in good standing",
  },
  {
    title: "Affiliation",
    value: "AFFILIATION",
    description:
      "I am a knowledgeable employee, executive officer, trustee, general partner or advisory board member of a private fund",
  },
];

const AccreditationQuestionnaire: FC<AccreditationQuestionnaireProps> = ({
  show,
  onClose,
}) => {
  const { data: userData } = useAccount();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid, errors },
    reset,
  } = useForm<yup.InferType<typeof schema>>({
    resolver: yupResolver(schema),
    defaultValues: schema.cast(
      { investAs: "INDIVIDUAL", circumstances: [], investment: [] },
      { assert: false }
    ) as DefaultValues<FormValues>,
    mode: "onChange",
  });

  const observableInvestAs = watch("investAs");
  const observableInvestment = watch("investment");

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      console.log(values);
      closeModal();
    } catch (err) {}
  };

  const closeModal = () => {
    onClose();
    setCurrentStep(1);
    reset(
      schema.cast(
        { investAs: "INDIVIDUAL", circumstances: [], investment: [] },
        { assert: false }
      ) as DefaultValues<FormValues>
    );
  };

  const nextStep: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <Dialog
      open={show}
      onClose={() => {}}
      className="fixed z-10 inset-0 max-w-md m-auto"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="md:flex items-center justify-center h-screen py-4 overflow-y-auto">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <Card className="relative md:flex flex-col border-0 p-0 z-10">
            <div className="flex items-center justify-between p-4 border-b border-white/[.12]">
              <div className="text-xl text-white font-medium">
                Accreditation
              </div>
              <Button variant="text">
                <X color="white" weight="bold" size={24} onClick={closeModal} />
              </Button>
            </div>
            <div className="flex flex-col md:flex-row flex-grow md:min-h-0 overflow-y-auto">
              <div className="flex flex-col p-4 md:w-[40rem]">
                {currentStep === 1 && (
                  <div id="accreditation-step1">
                    <div className="text-white font-medium">
                      Are you investing as an:
                    </div>
                    <div className="mt-3">
                      {INVEST_AS.map((item, index) => (
                        <div
                          key={`invest-as-${index}`}
                          className="flex items-center py-2"
                        >
                          <Radio
                            id={`investing-as-${index}`}
                            className="hidden"
                            value={item.value}
                            {...register("investAs")}
                          />
                          <Label
                            htmlFor={`investing-as-${index}`}
                            className={`
                              font-medium cursor-pointer uppercase rounded-full flex items-center px-4 w-full border border-info h-10 hover:bg-info
                              ${
                                observableInvestAs === item.value
                                  ? "bg-info"
                                  : "bg-info/[0.5]"
                              }
                            `}
                          >
                            <Image src={item.icon} height="24" />
                            <span className="ml-2">{item.title}</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                    <ErrorMessage name="investAs" errors={errors} />
                  </div>
                )}

                {currentStep === 2 && (
                  <div id="accreditation-step2">
                    <div className="text-white font-medium">
                      Select all that apply:
                    </div>
                    <div className="mt-3">
                      {CIRCUMSTANCES.map((item, index) => (
                        <div
                          key={`circumstances-${index}`}
                          className="flex items-start py-5 border-b border-white/[.13]"
                        >
                          <Checkbox
                            id={`income-${index}`}
                            className="shrink-0"
                            value={item.value}
                            {...register("circumstances")}
                          />
                          <Label
                            htmlFor={`income-${index}`}
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
                          onClick={() => setValue("circumstances", [])}
                        >
                          <span className="text-primary font-normal">
                            None of these apply to me
                          </span>
                        </Label>
                      </div>
                    </div>
                    <ErrorMessage name="circumstances" errors={errors} />
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
                        You're an Accredited Investor!
                      </h5>
                    </div>
                    <div className="py-4">
                      <div className="text-xs text-white leading-4 font-light mb-8 tracking-widest">
                        Some funds on Prometheus are only available to Qualified
                        Purchasers or Qualified Clients. To find out if you
                        qualify, complete the short questionairre bellow
                      </div>
                      <div className="mb-8">
                        <div className="text-white tracking-wider font-light">
                          Do you have at least $2.2M in investments?
                        </div>
                        <div className="flex items-center mt-3">
                          <input
                            type="checkbox"
                            value="2.2M"
                            className="hidden"
                            id="investment-2.2M"
                            {...register("investment")}
                          />
                          <label
                            htmlFor="investment-2.2M"
                            className={`
                              flex items-center justify-center border-primary border h-9 px-4 rounded-l text-xs uppercase cursor-pointer
                              ${
                                observableInvestment.includes("2.2M")
                                  ? "bg-primary text-white"
                                  : "bg-white text-primary"
                              }
                            `}
                          >
                            Yes
                          </label>
                          <label
                            htmlFor="investment-2.2M"
                            className={`
                              flex items-center justify-center border-primary border h-9 px-4 rounded-r text-xs uppercase cursor-pointer
                              ${
                                observableInvestment.includes("2.2M")
                                  ? "bg-white text-primary"
                                  : "bg-primary text-white"
                              }
                            `}
                          >
                            No
                          </label>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="text-white tracking-wider font-light">
                          Do you have at least $5M in investments?
                        </div>
                        <div className="flex items-center mt-3">
                          <input
                            type="checkbox"
                            value="5M"
                            className="hidden"
                            {...register("investment")}
                            id="investment-5M"
                          />
                          <label
                            htmlFor="investment-5M"
                            className={`
                              flex items-center justify-center border-primary border h-9 px-4 rounded-l text-xs uppercase cursor-pointer
                              ${
                                observableInvestment.includes("5M")
                                  ? "bg-primary text-white"
                                  : "bg-white text-primary"
                              }
                            `}
                          >
                            Yes
                          </label>
                          <label
                            htmlFor="investment-5M"
                            className={`
                              flex items-center justify-center border-primary border h-9 px-4 rounded-r text-xs uppercase cursor-pointer
                              ${
                                observableInvestment.includes("5M")
                                  ? "bg-white text-primary"
                                  : "bg-primary text-white"
                              }
                            `}
                          >
                            No
                          </label>
                        </div>
                      </div>
                    </div>
                    <ErrorMessage name="investment" errors={errors} />
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
                        Welcome!
                        <br />
                        You're a Qualified Purchaser!
                      </h5>
                    </div>
                    <div className="pb-4">
                      <div className="text-white text-xs tracking-widest font-light mb-3">
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
                    onClick={previousStep}
                  >
                    <Image src={ArrowLeft} alt="" height="20" />
                    &nbsp;Back
                  </Button>
                )}
              </div>
              <div className="flex items-center justify-center w-1/3">
                {[...Array(STEP_COUNT)].map((_, stepIndex) => (
                  <span
                    className={`rounded-full mx-1 w-[10px] h-[10px] ${
                      currentStep === stepIndex + 1
                        ? "bg-info"
                        : "bg-white/[.38]"
                    }`}
                  ></span>
                ))}
              </div>
              <div className="w-1/3 text-right">
                {currentStep !== STEP_COUNT ? (
                  <Button
                    type="button"
                    variant="outline-primary"
                    className="w-36 uppercase border border-info text-white bg-info/[.2] hover:bg-info/[.7]"
                    onClick={nextStep}
                  >
                    Continue&nbsp;
                    <Image src={ArrowRight} alt="" height="20" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="outline-primary"
                    className="w-36 uppercase border border-info text-white bg-info/[.2] hover:bg-info/[.7]"
                    loading={loading}
                  >
                    Close
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </form>
    </Dialog>
  );
};

export default AccreditationQuestionnaire;

import { FC, useState } from "react";
import { LoginPageProps } from "../LoginPage";
import { Transition } from "@headlessui/react";
import SignupForm, { FormValues } from "./SignupForm";
import TermsCheck from "./TermsCheck";
import { useRouter } from "next/router";

const SignupPage: FC<LoginPageProps> = ({ ssoProviders }) => {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormValues>();
  const { code } = router.query as Record<string, string>;

  return (
    <>
      <SignupForm
        show={step == 0}
        ssoProviders={ssoProviders}
        defaultValues={formData}
        onSubmit={(data) => {
          setFormData(data);
          setStep(1);
        }}
      />
      <Transition
        appear={true}
        show={step == 1}
        enter="transition-opacity ease-linear duration-100"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-linear duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        {formData && (
          <TermsCheck
            formData={formData}
            code={code}
            onBack={() => setStep(0)}
          />
        )}
      </Transition>
    </>
  );
};

export default SignupPage;

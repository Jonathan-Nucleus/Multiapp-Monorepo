import { ChangeEvent, FC, useState } from "react";
import LogoWithText from "shared/assets/images/logo-gradient.svg";
import Checkbox from "../../../common/Checkbox";
import Label from "../../../common/Label";
import Image from "next/image";
import Button from "../../../common/Button";
import { FormValues } from "../SignupForm";
import { useRegister } from "shared/graphql/mutation/auth/useRegister";
import { signIn } from "next-auth/react";
import { toast } from "../../../common/Toast";
import { Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import AnimatingLogo from "../../../modules/onboarding/AnimatingLogo";

interface TermsCheckProps {
  formData: FormValues;
  code: string;
  onBack: () => void;
}

const TermsCheck: FC<TermsCheckProps> = ({ formData, code, onBack }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [registerUser] = useRegister();
  const [step, setStep] = useState(0);
  const requestSignup = async () => {
    setLoading(true);
    const { email, firstName, lastName, password } = formData;
    const result = await registerUser({
      variables: {
        user: {
          email,
          firstName,
          lastName,
          password,
          inviteCode: code,
        },
      },
    });
    if (result.data?.register) {
      await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      });
      setStep(1);
      setTimeout(() => {
        setStep(2);
        setTimeout(() => {
          router.push("/");
        }, 1000);
      }, 1000);
    } else {
      setLoading(false);
      toast.error(
        "Uh oh, looks like a different email address than we have on record"
      );
    }
  };

  return (
    <>
      <div className="h-screen">
        {step != 2 && (
          <div className="text-center py-20">
            <Image src={LogoWithText} alt="" width={238} height={42} />
          </div>
        )}
        <AnimatingLogo show={step == 2} />
        <Transition
          show={step == 0}
          enter="transition-opacity ease-linear duration-1000"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-1000"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <h1 className="text-xl text-white font-medium mt-4">
            Terms & Services
          </h1>
          <div className="flex mt-6">
            <Checkbox
              checked={termsAgreed}
              id="terms-check"
              className="flex-shrink-0 mt-1"
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setTermsAgreed(event.target.checked)
              }
            />
            <Label htmlFor="terms-check" className="font-medium ml-4">
              <span>I agree to the Prometheus Alts</span>
              <span> </span>
              <a
                href="https://prometheusalts.com/legals/terms-of-use"
                className="text-primary text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms
              </a>
              <span>, </span>
              <a
                href="https://prometheusalts.com/legals/community-guidelines"
                className="text-primary text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Community
              </a>
              <span> and </span>
              <a
                href="https://prometheusalts.com/legals/privacy-policy"
                className="text-primary text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
            </Label>
          </div>
          <div className="mt-8">
            <Button
              type="button"
              variant="gradient-primary"
              className="w-full h-12 text-sm font-medium tracking-normal"
              disabled={!termsAgreed}
              loading={loading}
              onClick={() => requestSignup()}
            >
              Sign Up
            </Button>
          </div>
          <div className="text-center mt-8">
            <Button
              type="button"
              variant="text"
              className="text-sm text-primary font-medium tracking-normal"
              disabled={loading}
              onClick={onBack}
            >
              Go Back
            </Button>
          </div>
        </Transition>
      </div>
    </>
  );
};

export default TermsCheck;

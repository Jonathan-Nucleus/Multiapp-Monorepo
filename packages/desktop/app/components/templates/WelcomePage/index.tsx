import { FC, Fragment, useEffect, useState } from "react";
import LogoSoloGradient from "shared/assets/images/logo-solo-gradient.svg";
import LogoWithText from "shared/assets/images/logo-gradient.svg";
import Button from "../../common/Button";
import Link from "next/link";
import Image from "next/image";
import { Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import {
  KEY_HOME_TUTORIALS_SHOWN,
  LocalStorage,
} from "../../../lib/storageHelper";

const WelcomePage: FC = () => {
  const [step, setStep] = useState<number>();
  const router = useRouter();
  useEffect(() => {
    if (LocalStorage.getItem(KEY_HOME_TUTORIALS_SHOWN)) {
      router.replace(
        `/login${
          router.query.redirect ? "?redirect=" + router.query.redirect : ""
        }`
      );
    } else {
      setStep(0);
    }
  }, [router]);
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step == 0) {
      setTimeout(() => setStep(1), 4000);
    } else if (step == 1) {
      setTimeout(() => setStep(2), 1000);
    } else if (step == 2) {
      timer = setTimeout(() => {
        if (step == 2) {
          setStep(3);
        }
      }, 4000);
    } else if (step == 3) {
      timer = setTimeout(() => {
        if (step == 3) {
          setStep(2);
        }
      }, 4000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [step]);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="w-full h-[512px] relative">
        <Transition as={Fragment} appear={true} show={step == 0}>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Transition.Child
              enter="transition-all ease-linear duration-1000"
              enterFrom="opacity-0 scale-50"
              enterTo="opacity-100 scale-100"
              leave="transition-all ease-linear duration-1000"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-50"
            >
              <Image src={LogoSoloGradient} alt="" />
            </Transition.Child>
            <Transition.Child
              enter="transition-all ease-linear duration-1000"
              enterFrom="opacity-0 -translate-y-6"
              enterTo="opacity-100 translate-y-0"
              leave="transition-all ease-linear duration-1000"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 -translate-y-6"
            >
              <h1 className="text-2xl font-medium mt-8">
                Welcome to Prometheus.
              </h1>
            </Transition.Child>
          </div>
        </Transition>
        <Transition
          as={Fragment}
          appear={true}
          show={step == 2}
          enter="transition-opacity ease-linear duration-1000"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-1000"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute inset-0 flex flex-col items-center bg-welcomeInsights bg-contain bg-no-repeat bg-center">
            <div className="py-12">
              <Image src={LogoWithText} alt="" width={238} height={42} />
            </div>
            <div className="mt-auto">
              <h1 className="text-2xl font-medium text-center">
                <div>Get professional</div>
                <div>investment insights.</div>
              </h1>
              <div className="flex items-center justify-center mt-8 py-1">
                <Button
                  variant="text"
                  className="w-2 h-2 bg-gray-200 rounded-full mx-1 !p-0"
                />
                <Button
                  variant="text"
                  className="w-2 h-2 bg-gray-800 rounded-full mx-1 !p-0"
                  onClick={() => setStep(3)}
                />
              </div>
            </div>
          </div>
        </Transition>
        <Transition
          as={Fragment}
          appear={true}
          show={step == 3}
          enter="transition-opacity ease-linear duration-1000"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-1000"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute inset-0 flex flex-col items-center bg-welcomeFunds bg-contain bg-no-repeat bg-center">
            <div className="py-12">
              <Image src={LogoWithText} alt="" width={238} height={42} />
            </div>
            <div className="mt-auto">
              <h1 className="text-2xl font-medium text-center">
                <div>Access high-quality</div>
                <div>alternative funds.</div>
              </h1>
              <div className="text-tiny text-gray-400 text-center my-2">
                (Accredited investors only)
              </div>
              <div className="flex items-center justify-center py-1">
                <Button
                  variant="text"
                  className="w-2 h-2 bg-gray-800 rounded-full mx-1 !p-0"
                  onClick={() => setStep(2)}
                />
                <Button
                  variant="text"
                  className="w-2 h-2 bg-gray-200 rounded-full mx-1 !p-0"
                />
              </div>
            </div>
          </div>
        </Transition>
      </div>
      <div className="w-full mt-12 px-3 pb-12">
        <div>
          <Link href="/invite-code">
            <a>
              <Button
                variant="gradient-primary"
                className="w-full h-12 text-sm font-medium tracking-normal"
              >
                Get Started
              </Button>
            </a>
          </Link>
        </div>
        <div className="text-center">
          <Link href="/login">
            <a>
              <Button
                variant="text"
                className="text-sm text-primary font-medium tracking-normal mt-4"
              >
                I already have an account.
              </Button>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;

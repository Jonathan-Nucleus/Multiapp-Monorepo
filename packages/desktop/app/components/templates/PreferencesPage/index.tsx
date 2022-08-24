import { FC, useEffect, useState } from "react";
import CategoryPreference from "./CategoryPreference";
import BuildingFeed from "./BuildingFeed";
import { useMutation } from "@apollo/client";
import { UPDATE_SETTINGS } from "shared/graphql/mutation/account";
import { toast } from "../../common/Toast";
import UserTypeSettings from "./UserTypeSettings";
import AnimatingLogo from "../../modules/onboarding/AnimatingLogo";
import { useRouter } from "next/router";

const PreferencesPage: FC = () => {
  const [step, setStep] = useState(0);
  const [updateSettings] = useMutation(UPDATE_SETTINGS);
  const router = useRouter();
  const onSubmit = async (selections: string[]) => {
    setStep(1);
    const timeout = 2000;
    const startTime = new Date().getTime();
    const { data } = await updateSettings({
      variables: {
        settings: {
          interests: selections,
        },
      },
    });
    const endTime = new Date().getTime();
    setTimeout(() => {
      if (data && data.updateSettings) {
        setStep(2);
      } else {
        toast.error("Failed to update preferences");
        setStep(0);
      }
    }, Math.max(timeout - (endTime - startTime), 0));
  };
  useEffect(() => {
    if (step == 3) {
      setTimeout(async () => {
        await router.push("/");
      }, 1000);
    }
  }, [router, step]);
  return (
    <>
      {step == 0 && (
        <CategoryPreference
          show={step == 0}
          onNext={(selections) => onSubmit(selections)}
        />
      )}
      {step == 1 && <BuildingFeed show={step == 1} />}
      {step == 2 && (
        <UserTypeSettings
          show={step == 2}
          onBack={() => setStep(0)}
          onComplete={() => setStep(3)}
        />
      )}
      {step == 3 && <AnimatingLogo show={step == 3} />}
    </>
  );
};

export default PreferencesPage;

import { ChangeEvent, FC, useState } from "react";
import { UserTypeOptions } from "backend/schemas/user";
import Checkbox from "../../../common/Checkbox";
import Button from "../../../common/Button";
import { Transition } from "@headlessui/react";
import Image from "next/image";
import LogoWithText from "shared/assets/images/logo-gradient.svg";

interface UserTypeSettingsProps {
  show: boolean;
  onBack: () => void;
  onComplete: () => void;
}

const UserTypeSettings: FC<UserTypeSettingsProps> = ({
  show,
  onBack,
  onComplete,
}) => {
  const [selections, setSelections] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const submitRequest = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onComplete();
    }, 500);
  };
  return (
    <>
      <Transition appear={true} show={show}>
        <div className="text-center py-20">
          <Image src={LogoWithText} alt="" width={238} height={42} />
        </div>
        <Transition.Child
          enter="transition-opacity ease-linear duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="text-white text-center font-medium mt-3">
            <div>Which of the following</div>
            <div>best describes you?</div>
          </div>
          <div className="mt-6">
            {Object.keys(UserTypeOptions).map((key) => (
              <div
                key={key}
                className={`rounded-full border border-primary-solid 
                  hover:bg-primary-solid cursor-pointer transition-all ${
                    selections.includes(key) ? "bg-primary-solid" : ""
                  } mb-4`}
                onClick={() => {
                  if (!selections.includes(key)) {
                    setSelections([...selections, key]);
                  } else {
                    setSelections(selections.filter((item) => item != key));
                  }
                }}
              >
                <div className="flex items-center p-4">
                  <Checkbox
                    className="bg-transparent accent-white"
                    checked={selections.includes(key)}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      if (event.target.checked) {
                        setSelections([...selections, key]);
                      } else {
                        setSelections(selections.filter((item) => item != key));
                      }
                    }}
                  />
                  <div className="text-sm text-white font-medium ml-2">
                    {UserTypeOptions[key]}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-16">
            <Button
              type="button"
              variant="text"
              className="text-sm text-primary font-medium tracking-normal px-0"
              onClick={onBack}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="gradient-primary"
              className="w-32 text-sm font-medium tracking-normal"
              disabled={selections.length == 0}
              loading={loading}
              onClick={() => submitRequest()}
            >
              Finish
            </Button>
          </div>
        </Transition.Child>
      </Transition>
    </>
  );
};

export default UserTypeSettings;

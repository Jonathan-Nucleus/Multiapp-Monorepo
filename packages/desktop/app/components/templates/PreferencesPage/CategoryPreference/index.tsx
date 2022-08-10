import { ChangeEvent, FC, useState } from "react";
import { PostCategoryOptions } from "backend/schemas/post";
import Checkbox from "../../../common/Checkbox";
import Link from "next/link";
import Button from "../../../common/Button";
import Image from "next/image";
import LogoWithText from "shared/assets/images/logo-gradient.svg";
import { Transition } from "@headlessui/react";

interface CategoryPreferenceProps {
  show: boolean;
  onNext: (selections: string[]) => void;
}

const CategoryPreference: FC<CategoryPreferenceProps> = ({ show, onNext }) => {
  const [selections, setSelections] = useState<string[]>([]);
  return (
    <>
      <Transition appear={true} show={show}>
        <div className="text-center pt-20 pb-16">
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
          <h1 className="text-white text-center font-medium">
            <div>Select at least 3 topics to help us</div>
            <div>personalize your experience.</div>
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-4 mt-8">
            {Object.keys(PostCategoryOptions).map((key) => (
              <div
                key={key}
                className={`rounded-full border border-primary-solid 
                  hover:bg-primary-solid cursor-pointer transition-all ${
                    selections.includes(key) ? "bg-primary-solid" : ""
                  }`}
                onClick={() => {
                  if (!selections.includes(key)) {
                    setSelections([...selections, key]);
                  } else {
                    setSelections(selections.filter((item) => item != key));
                  }
                }}
              >
                <div className="flex items-center px-4 py-3">
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
                    {PostCategoryOptions[key].label}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-row justify-between mt-10 mb-10">
            <div>
              <Link href={"/"}>
                <a>
                  <Button
                    variant="text"
                    className="text-sm text-primary font-medium px-4"
                  >
                    Skip
                  </Button>
                </a>
              </Link>
            </div>
            <div>
              <Button
                variant="gradient-primary"
                className="w-32 text-sm font-medium"
                disabled={selections.length < 3}
                onClick={() => onNext(selections)}
              >
                Next
              </Button>
            </div>
          </div>
        </Transition.Child>
      </Transition>
    </>
  );
};

export default CategoryPreference;

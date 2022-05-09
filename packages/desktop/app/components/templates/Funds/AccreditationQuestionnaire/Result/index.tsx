import { FC } from "react";
import { CircleWavy } from "phosphor-react";

import Button from "desktop/app/components/common/Button";
import { Accreditation } from "backend/graphql/users.graphql";

const RESPONSES: Record<
  Accreditation,
  { icon: string; title: string; subtitle: string }
> = {
  NONE: {
    icon: "",
    title: "Sorry",
    subtitle:
      "At this time, you do not meet the legal definition of an Accredited Investor.",
  },
  ACCREDITED: {
    icon: "",
    title: "",
    subtitle:
      "Thank you for providing the information required by law to verify your status as an accredited investor.",
  },
  QUALIFIED_CLIENT: {
    icon: "QC",
    title: "You're a Qualified Client",
    subtitle: "Thank you for verifying your qualified client status.",
  },
  QUALIFIED_PURCHASER: {
    icon: "QP",
    title: "You're a Qualified Purchaser",
    subtitle: "Thank you for verifying your qualified purchaser status.",
  },
};

interface AccreditationResultProps {
  accreditation: Accreditation;
  onClose: () => void;
}

const AccreditationResult: FC<AccreditationResultProps> = ({
  accreditation,
  onClose,
}) => {
  const { icon, title, subtitle } = RESPONSES[accreditation];
  return (
    <div className="mt-4">
      {accreditation === "NONE" ? (
        <div className="flex flex-col justify-start border-b border-white/[.12]">
          <h5 className="text-left text-white mt-3 text-2xl tracking-wide font-light mb-4 px-8">
            {title}
          </h5>
          <div className="text-sm text-white leading-5 font-extralight mb-8 tracking-widest px-8">
            {subtitle}
          </div>
        </div>
      ) : accreditation === "ACCREDITED" ? (
        <div className="flex flex-col justify-center border-b border-white/[.12] py-2">
          <div className="text-sm text-white leading-5 font-extralight mb-5 tracking-widest px-5">
            {subtitle}
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center border-b border-white/[.12] py-6">
          {icon !== "" && (
            <div className="text-success relative flex justify-center">
              <CircleWavy
                color="currentColor"
                weight="fill"
                size={100}
                className="self-center"
              />
              <div
                className={`absolute top-0 left-0 w-full h-full flex items-center
                justify-center text-3xl font-bold text-white`}
              >
                {icon}
              </div>
            </div>
          )}
          <h5 className="text-center text-white mt-3 text-xl tracking-wider font-medium mb-3">
            Awesome!
            <br />
            {title}
          </h5>
          <div className="text-sm text-white leading-5 font-extralight my-4 tracking-widest px-5">
            {subtitle}
          </div>
        </div>
      )}
      <div className="p-3 flex flex-row items-center justify-end">
        <Button
          type="submit"
          variant="outline-primary"
          className="w-36 h-10 border border-info text-white bg-info/[.2] hover:bg-info/[.7]"
          onClick={onClose}
        >
          close
        </Button>
      </div>
    </div>
  );
};

export default AccreditationResult;

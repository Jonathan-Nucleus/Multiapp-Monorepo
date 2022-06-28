import { FC, useState, HTMLProps } from "react";
import { Info } from "phosphor-react";
import Button from "../../../common/Button";
import Card from "../../../common/Card";
import DisclosureModal from "../DisclosureModal";

interface DisclosureCardProps extends HTMLProps<HTMLDivElement> {
  title?: string;
}

const DisclosureCard: FC<DisclosureCardProps> = ({
  title = "Disclosures",
  className,
  ...props
}) => {
  const [showDisclosureModal, setShowDisclosureModal] = useState(false);
  return (
    <Card {...props} className={`py-2 ${className ?? ""}`}>
      <Button
        variant="text"
        className="text-white/[0.4] flex items-center tracking-normal font-normal"
        onClick={() => setShowDisclosureModal(true)}
      >
        <Info color="currentColor" weight="light" size={20} />
        <span className="ml-2">{title}</span>
      </Button>
      <DisclosureModal
        show={showDisclosureModal}
        onClose={() => setShowDisclosureModal(false)}
      />
    </Card>
  );
};

export default DisclosureCard;

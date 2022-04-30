import { FC, useState } from "react";
import { useRouter } from "next/router";
import Button from "../../common/Button";
import BecomeProModal from "../../modules/setting/BecomeProModal";
import ContactusModal from "../../modules/setting/Contact";

const SettingPage: FC = () => {
  const router = useRouter();
  const [isVisible, setVisible] = useState(false);
  const [isContactVisible, setContactVisible] = useState(false);
  return (
    <div className="flex items-center p-4 justify-center">
      <Button
        variant="gradient-primary"
        className="w-48 mt-12"
        onClick={() => setVisible(true)}
      >
        Become a Pro
      </Button>
      <Button
        variant="gradient-primary"
        className="w-48 mt-12"
        onClick={() => setContactVisible(true)}
      >
        contact us
      </Button>
      <BecomeProModal show={isVisible} onClose={() => setVisible(false)} />
      <ContactusModal
        show={isContactVisible}
        onClose={() => setContactVisible(false)}
      />
    </div>
  );
};

export default SettingPage;

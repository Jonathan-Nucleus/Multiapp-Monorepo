import { Dialog } from "@headlessui/react";
import { ChangeEvent, FC, useState } from "react";
import {
  Buildings,
  User,
  X,
  GlobeHemisphereEast,
  CircleWavy,
  Image as ImageIcon,
  Smiley,
  CaretDown,
} from "phosphor-react";
import Card from "../../../../common/Card";
import Image from "next/image";
import Button from "../../../../common/Button";
import UserDropdown from "./UserDropdown";
import Textarea from "../../../../common/Textarea";
import CategorySelector from "./CategorySelector";

const profileImage =
  "https://t4.ftcdn.net/jpg/02/45/56/35/360_F_245563558_XH9Pe5LJI2kr7VQuzQKAjAbz9PAyejG1.jpg";

const userOptions = [
  {
    icon: <User color="currentColor" weight="fill" size={24} />,
    title: "Richard Branson",
  },
  {
    icon: <Buildings color="currentColor" weight="fill" size={24} />,
    title: "Virgin Atlantic",
  },
];

const visibleOptions = [
  {
    icon: <GlobeHemisphereEast color="currentColor" weight="fill" size={24} />,
    title: "Everyone",
  },
  {
    icon: (
      <div className="text-success relative">
        <CircleWavy color="currentColor" weight="fill" size={24} />
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs font-bold scale-75 text-white">
          QP
        </div>
      </div>
    ),
    title: "Qualified Purchasers",
  },
  {
    icon: (
      <div className="text-success relative">
        <CircleWavy color="currentColor" weight="fill" size={24} />
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs font-bold scale-75 text-white">
          QC
        </div>
      </div>
    ),
    title: "Qualified Clients",
  },
  {
    icon: (
      <div className="text-success relative">
        <CircleWavy color="currentColor" weight="fill" size={24} />
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs font-bold scale-75 text-white">
          AI
        </div>
      </div>
    ),
    title: "Accredited Investors",
  },
];

interface CreatePostModalProps {
  show: boolean;
  onClose: () => void;
}

const CreatePostModal: FC<CreatePostModalProps> = ({ show, onClose }) => {
  const [selectedUser, setSelectedUser] = useState(0);
  const [selectedVisible, setSelectedVisible] = useState(0);
  const [text, setText] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  return (
    <>
      <Dialog
        open={show}
        onClose={onClose}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <Card className="flex flex-col border-0 h-3/4 mx-auto p-0 z-10">
            <div className="flex items-center justify-between p-4 border-b border-white/[.12]">
              <div className="text-xl text-white font-medium">Create Post</div>
              <Button variant="text">
                <X color="white" weight="bold" size={24} onClick={onClose} />
              </Button>
            </div>
            <div className="flex flex-row min-h-0 flex-grow">
              <div className="flex flex-col w-[40rem]">
                <div className="flex items-center p-4">
                  <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
                    <Image
                      loader={() => profileImage}
                      src={profileImage}
                      alt=""
                      width={56}
                      height={56}
                      className="object-cover rounded-full"
                      unoptimized={true}
                    />
                  </div>
                  <div className="ml-2">
                    <UserDropdown
                      selected={selectedUser}
                      items={userOptions}
                      onSelect={setSelectedUser}
                    />
                  </div>
                  <div className="ml-2">
                    <UserDropdown
                      selected={selectedVisible}
                      items={visibleOptions}
                      onSelect={setSelectedVisible}
                    />
                  </div>
                </div>
                <div className="mx-4 mt-2 caret-primary min-h-0 flex-grow">
                  <Textarea
                    className="bg-transparent w-full text-sm text-white h-48 max-h-80"
                    placeholder={
                      "Create a post\nUse $ before ticker symbols: ex: $TSLA\nUse @ to tag a user, page or fund"
                    }
                    value={text}
                    onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                      setText(event.target.value)
                    }
                  />
                </div>
                <div className="mx-4 mt-2 mb-2">
                  <div className="flex items-center">
                    <div className="flex items-center cursor-pointer">
                      <div className="text-purple-secondary">
                        <ImageIcon
                          color="currentColor"
                          weight="light"
                          size={24}
                        />
                      </div>
                      <div className="text-sm text-white/[.6] ml-2">
                        Photo/Video
                      </div>
                    </div>
                    <div className="flex items-center text-white/[.6] ml-4 cursor-pointer">
                      <div className="text-success">
                        <Smiley color="currentColor" weight="light" size={24} />
                      </div>
                      <div className="text-sm ml-2">Emoji</div>
                      <CaretDown
                        color="currentColor"
                        weight="bold"
                        size={16}
                        className="ml-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {showCategories && (
                <div className="w-80 border-l border-white/[.12]">
                  <CategorySelector />
                </div>
              )}
            </div>
            <div className="border-t border-white/[.12] flex items-center justify-between p-4">
              <Button
                variant="text"
                className="text-primary font-medium"
                onClick={() => onClose()}
              >
                CANCEL
              </Button>
              <Button
                variant="gradient-primary"
                className="w-48 font-medium"
                disabled={!text}
                onClick={() => {
                  setShowCategories(true);
                }}
              >
                NEXT
              </Button>
            </div>
          </Card>
        </div>
      </Dialog>
    </>
  );
};

export default CreatePostModal;

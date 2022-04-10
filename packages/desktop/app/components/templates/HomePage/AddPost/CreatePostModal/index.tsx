import { ChangeEvent, FC, useState, useEffect, FormEventHandler } from "react";
import { Dialog } from "@headlessui/react";
import { MentionsInput, Mention, OnChangeHandlerFunc } from "react-mentions";
import {
  Buildings,
  User,
  X,
  GlobeHemisphereEast,
  CircleWavy,
  Image as ImageIcon,
  Smiley,
  CaretDown,
  XCircle,
} from "phosphor-react";
import { useSession } from "next-auth/react";
import { useMutation } from "@apollo/client";
import Image from "next/image";

import UserDropdown from "./UserDropdown";
import CategorySelector from "./CategorySelector";
import Card from "../../../../common/Card";
import Button from "../../../../common/Button";
import Textarea from "../../../../common/Textarea";
import Input from "../../../../common/Input";
import defaultStyle from "./styles";
import defaultMentionStyle from "./defaultMentionStyle";
import {
  CREATE_POST,
  useFetchUploadLink,
} from "desktop/app/graphql/mutations/posts";

const profileImage =
  "https://t4.ftcdn.net/jpg/02/45/56/35/360_F_245563558_XH9Pe5LJI2kr7VQuzQKAjAbz9PAyejG1.jpg";

const users = [
  {
    id: "walter",
    display: "Walter White",
  },
  {
    id: "jesse",
    display: "Jesse Pinkman",
  },
  {
    id: "gus",
    display: 'Gustavo "Gus" Fring',
  },
  {
    id: "saul",
    display: "Saul Goodman",
  },
  {
    id: "hank",
    display: "Hank Schrader",
  },
  {
    id: "skyler",
    display: "Skyler White",
  },
  {
    id: "mike",
    display: "Mike Ehrmantraut",
  },
  {
    id: "lydia",
    display: "Lydìã Rôdarté-Qüayle",
  },
];

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
  const [selectedFile, setSelectedFile] = useState<File>();
  const [preview, setPreview] = useState("");
  const [value, setValue] = useState("");
  const [ids, setIds] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [selections, setSelections] = useState<string[]>([]);
  const [createPost] = useMutation(CREATE_POST);
  const [fetchUploadLink] = useFetchUploadLink();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!selectedFile) {
      setPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile: FormEventHandler<HTMLInputElement> = (e) => {
    const taget = e.currentTarget;
    if (!taget.files || taget.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(taget.files[0]);
  };

  const handleChange: OnChangeHandlerFunc = (event, mentions) => {
    const taget = event.target;
    setMessage(mentions);
    if (taget.value) {
      setValue(taget.value);
    } else {
      setIds([]);
    }
  };

  const onAdd = (id: string | number, display: string) => {
    const _ids = [...ids];
    _ids.push(id);
    setIds(_ids);
  };

  const handleClear = () => {
    setSelectedFile(undefined);
    setPreview("");
  };

  const handleNext = async () => {
    const key = Date.now().toString();
    try {
      let mediaUrl = "";
      if (selectedFile) {
        const { data } = await fetchUploadLink({
          variables: {
            localFilename: selectedFile.name,
          },
        });

        if (!data || !data.uploadLink) {
          console.log("Error fetching upload link");
          return;
        }

        const { remoteName, uploadUrl } = data.uploadLink;
        const response = await fetch(uploadUrl, {
          method: "PUT",
          body: selectedFile,
        });

        mediaUrl = remoteName;
      }

      const result = await createPost({
        variables: {
          post: {
            categories: selections,
            audience: "EVERYONE",
            body: "This is my post",
            mediaUrl: mediaUrl,
            mentionIds: [],
          },
        },
      });

      onClose();
    } catch (err) {
      console.log("icreatePost error", err);
    }
  };

  return (
    <>
      <Dialog
        open={show}
        onClose={onClose}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <Card className="flex flex-col border-0 h-3/4 mx-auto p-0 z-10  overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-white/[.12]">
              <div className="text-xl text-white font-medium">Create Post</div>
              <Button variant="text">
                <X color="white" weight="bold" size={24} onClick={onClose} />
              </Button>
            </div>
            <div className="flex flex-col min-h-0 flex-grow md:flex-row ">
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
                  {/* <Textarea
                    className="bg-transparent w-full text-sm text-white h-48 max-h-80"
                    placeholder={
                      "Create a post\nUse $ before ticker symbols: ex: $TSLA\nUse @ to tag a user, page or fund"
                    }
                    value={text}
                    onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                      setText(event.target.value)
                    }
                  /> */}
                  <MentionsInput
                    value={value}
                    onChange={handleChange}
                    style={defaultStyle}
                    placeholder={"Mention people using '@'"}
                  >
                    <Mention
                      trigger="@"
                      data={users}
                      style={defaultMentionStyle}
                      onAdd={onAdd}
                    />
                  </MentionsInput>
                </div>
                <div className="mb-4 max-h-72 max-w-full h-72 mt-2">
                  {selectedFile && preview && (
                    <div className="relative  max-h-72">
                      <div className="h-64 relative w-full">
                        <Image
                          alt="Mountains"
                          src={preview}
                          layout="fill"
                          className="rounded-md"
                          objectFit="cover"
                        />
                      </div>
                      <Button
                        variant="text"
                        className="absolute top-0 right-0"
                        onClick={handleClear}
                      >
                        <XCircle size={32} color="#5F5F5F" weight="fill" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="mx-4 mt-2 mb-2">
                  <div className="flex items-center">
                    <Input
                      type="file"
                      onChange={onSelectFile}
                      className="absolute w-32 opacity-0 cursor-pointer"
                      accept="image/*, video/*, audio/*"
                    />
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
                // disabled={!text}
                onClick={() => {
                  showCategories ? handleNext() : setShowCategories(true);
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

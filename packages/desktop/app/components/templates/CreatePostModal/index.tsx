import { FC, useState, useEffect, ChangeEvent } from "react";
import { MentionsInput, Mention } from "react-mentions";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useMutation } from "@apollo/client";
import { Smiley, Image as ImageIcon, XCircle } from "phosphor-react";
import AWS from "aws-sdk";
import { getApolloClient } from "desktop/app/lib/apolloClient";

import Modal from "../../common/Modal";
import Input from "../../common/Input";
import Checkbox from "../../common/Checkbox";
import Label from "../../common/Label";
import defaultStyle from "./styles";
import defaultMentionStyle from "./defaultMentionStyle";
import Button from "../../common/Button";
import { CREATE_POST } from "../../../graphql/mutations/posts";

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

const preferences = [
  "NEWS",
  "POLITICS",
  "IDEAS",
  "EDUCATION",
  "QUESTIONS",
  "TECH",
  "CONSUMER",
  "INDUSTRIALS",
  "HEALTHCARE",
  "FINANCIALS",
  "ENERGY",
  "CRYPTO",
];

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SERCRET_ACCESS_KEY,
});

const bucket = new AWS.S3({
  params: { Bucket: process.env.S3_BUCKET_NAME },
  region: process.env.AWS_REGION,
});

interface CreatePostModalProps {
  setOpen: (open: boolean) => void;
}

const CreatePostModal: FC<CreatePostModalProps> = (props) => {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [preview, setPreview] = useState("");
  const [value, setValue] = useState("");
  const [ids, setIds] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [selections, setSelections] = useState<string[]>([]);
  const [createPost] = useMutation(CREATE_POST);
  const { data: session, status } = useSession();

  console.log(333, process.env.ACCESS_KEY_ID);

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

  const onSelectFile = (e: Event) => {
    const taget = e.target as HTMLInputElement;
    if (!taget.files || taget.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(taget.files[0]);
  };

  const handleChange = (event: Event, mentions: string) => {
    const taget = event.target as HTMLInputElement;
    console.log("mentions", mentions);
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
      const params = {
        ACL: "public-read",
        Body: selectedFile,
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      };

      await bucket.putObject(params);
      const url = bucket.getSignedUrl("getObject", { Key: params.Key });

      await getApolloClient(session.access_token).mutate({
        mutation: CREATE_POST,
        variables: {
          post: {
            categories: selections,
            audience: "EVERYONE",
            body: "This is my post",
            mediaUrl: url,
            mentionIds: [],
          },
        },
      });
      props.setOpen(false);
    } catch (err) {
      console.log("icreatePost error", err);
    }
  };

  return (
    <Modal
      onClose={() => props.setOpen(false)}
      handleNext={handleNext}
      title="Create Post"
      nextLabel="Next"
    >
      <div className="flex relative min-h-full flex-col md:flex-row">
        <div className="w-full md:w-2/3 mr-0 md:mr-3">
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
          <div className="text-sm text-zinc-500">
            Use $ before ticker symbols: ex: $TSLA Use @ to tag a user, page or
            fund
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
                    // objectFit="contain"
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
          <Input
            type="file"
            onChange={onSelectFile}
            className="absolute w-32 opacity-0"
            accept="image/*, video/*, audio/*"
          />
          <div className="flex items-center">
            <div className="flex items-center cursor-pointer">
              <ImageIcon size={18} />
              <div className="text-sm text-slate-300 ml-1 mr-4">
                Photo/Video
              </div>
            </div>
            <Smiley size={18} />
            <div className="text-sm text-slate-300 ml-1">Email</div>
          </div>
        </div>
        <div className="w-full md:w-1/3">
          <div className="text-sm text-white opacity-60">Categories</div>
          <div className="mt-2 text-sm text-white opacity-60">
            Select categories to make your post easier to find and visible to
            more people.
          </div>
          <div className="overflow-auto max-h-72">
            {preferences.map((preference) => (
              <div
                key={preference}
                className=" flex flex-row items-center px-3 py-2"
              >
                <Checkbox
                  id={`preference-${preference}`}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    const _selections = [...selections];
                    const index = _selections.indexOf(preference);
                    if (event.target.checked) {
                      if (index == -1) {
                        _selections.push(preference);
                      }
                    } else {
                      if (index != -1) {
                        _selections.splice(index, 1);
                      }
                    }
                    setSelections(_selections);
                  }}
                />
                <Label htmlFor={`preference-${preference}`} className="ml-2">
                  {preference}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreatePostModal;

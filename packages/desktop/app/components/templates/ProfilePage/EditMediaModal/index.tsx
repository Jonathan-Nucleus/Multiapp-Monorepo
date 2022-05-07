import React, { FC, useState, useRef } from "react";
import { Dialog } from "@headlessui/react";
import Image from "next/image";
import { X, Trash, UploadSimple } from "phosphor-react";

import Card from "../../../common/Card";
import Button from "../../../common/Button";
import Input from "../../../common/Input";
import { useFetchUploadLink } from "mobile/src/graphql/mutation/posts";
import { useUpdateUserProfile } from "mobile/src/graphql/mutation/account";
import { MediaType } from "backend/graphql/mutations.graphql";
import { UserProfile } from "mobile/src/graphql/query/user/useProfile";
import ModalDialog from "../../../common/ModalDialog";

interface EditMediaModalProps {
  type: MediaType;
  user: UserProfile;
  show: boolean;
  onClose: () => void;
}

const EditMediaModal: FC<EditMediaModalProps> = ({
  type,
  user,
  show,
  onClose,
}: EditMediaModalProps) => {
  const [fetchUploadLink] = useFetchUploadLink();

  const selectedFile = useRef<File | undefined>(undefined);
  const [localFileUrl, setLocalFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [updateUserProfile] = useUpdateUserProfile();

  const uploadMedia = async () => {
    const file: File | undefined = selectedFile.current;
    if (!file) {
      return;
    }
    setLoading(true);
    try {
      const { data } = await fetchUploadLink({
        variables: {
          localFilename: file.name,
          type: type,
        },
      });

      if (!data || !data.uploadLink) {
        console.log("Error fetching upload link");
        return;
      }

      const { remoteName, uploadUrl } = data.uploadLink;
      await fetch(uploadUrl, {
        method: "PUT",
        body: file,
      });

      if (type === "AVATAR") {
        const profile = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: remoteName,
        };
        await updateUserProfile({
          variables: {
            profile,
          },
        });
      }

      if (type === "BACKGROUND") {
        const profile = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          background: {
            url: remoteName,
            width: 500,
            height: 200,
            x: 0,
            y: 0,
            scale: 2,
          },
        };
        await updateUserProfile({
          variables: {
            profile,
          },
        });
      }
      setLoading(false);
      setLocalFileUrl(null);
      onClose();
    } catch (err) {
    }
  };

  return (
    <>
      <ModalDialog
        title={type === "AVATAR" ? "Profile Photo" : "Cover Photo"}
        show={show}
        onClose={onClose}
      >
        <>
          {type === "AVATAR" ? (
            <div className="flex items-center p-4 justify-between flex-wrap">
              {localFileUrl ? (
                <div className="relative">
                  <div className="h-60 w-60 relative">
                    <Image
                      alt="Mountains"
                      src={localFileUrl}
                      className="rounded-full object-cover"
                      layout="fill"
                      onLoad={() => {
                        if (selectedFile.current) {
                          URL.revokeObjectURL(localFileUrl);
                        }
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="h-60 w-60 relative" />
              )}
              <div className="relative">
                <Input
                  id="image-select"
                  type="file"
                  value=""
                  onInput={async (evt) => {
                    const file = evt.currentTarget.files?.[0];
                    selectedFile.current = file;
                    if (file) {
                      setLocalFileUrl(URL.createObjectURL(file));
                    }
                  }}
                  accept="image/*"
                  className="w-52 absolute left-2 opacity-0"
                />
                <Button
                  variant="outline-primary"
                  className="border rounded-full bg-transaprent"
                >
                  <UploadSimple size={24} color="white" />
                  <div className="text text-white">UPLOAD NEW PHOTO</div>
                </Button>
              </div>
              {localFileUrl && (
                <div
                  className="border border-primary rounded-full p-2 cursor-pointer"
                  onClick={() => {
                    selectedFile.current = undefined;
                    URL.revokeObjectURL(localFileUrl);
                    setLocalFileUrl(null);
                  }}
                >
                  <Trash size={24} color="#FFFFFF" />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center p-4">
              {localFileUrl ? (
                <div className="relative w-full">
                  <div className="w-screen max-w-full h-16 lg:h-32 relative">
                    <Image
                      alt="Mountains"
                      src={localFileUrl}
                      layout="fill"
                      objectFit="cover"
                      onLoad={() => {
                        if (selectedFile.current) {
                          URL.revokeObjectURL(localFileUrl);
                        }
                      }}
                      className="rounded-t-xl"
                    />
                  </div>
                </div>
              ) : (
                <div className="h-32 w-full relative" />
              )}
              <div className="flex flex-wrap items-center justify-center mt-3">
                <div className="relative">
                  <Input
                    id="image-select"
                    type="file"
                    value=""
                    onInput={async (evt) => {
                      const file = evt.currentTarget.files?.[0];
                      selectedFile.current = file;
                      if (file) {
                        setLocalFileUrl(URL.createObjectURL(file));
                      }
                    }}
                    accept="image/*"
                    className="w-52 absolute left-2 opacity-0"
                  />
                  <Button
                    variant="outline-primary"
                    className="border rounded-full bg-transaprent"
                  >
                    <UploadSimple size={24} color="white" />
                    <div className="text text-white">UPLOAD NEW PHOTO</div>
                  </Button>
                </div>
                {localFileUrl && (
                  <div
                    className="border border-primary rounded-full p-2 cursor-pointer ml-3"
                    onClick={() => {
                      selectedFile.current = undefined;
                      URL.revokeObjectURL(localFileUrl);
                      setLocalFileUrl(null);
                    }}
                  >
                    <Trash size={24} color="#FFFFFF" />
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="flex justify-between border-t p-4">
            <Button
              type="button"
              variant="outline-primary"
              className="text-primary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="gradient-primary"
              className="leading-6"
              disabled={loading}
              loading={loading}
              onClick={uploadMedia}
            >
              Save
            </Button>
          </div>
        </>
      </ModalDialog>
    </>
  );
};

export default EditMediaModal;

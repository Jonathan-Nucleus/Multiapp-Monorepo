import React, { ChangeEvent, FC, useEffect, useState, useRef } from "react";
import { Dialog, Tab } from "@headlessui/react";
import { User } from "backend/graphql/users.graphql";
import Image from "next/image";
import { X, Image as ImageIcon, Trash, UploadSimple } from "phosphor-react";

import Card from "../../../common/Card";
import Button from "../../../common/Button";
import Input from "../../../common/Input";
import { useAccount } from "mobile/src/graphql/query/account";
import { useFetchUploadLink } from "mobile/src/graphql/mutation/posts";
import { CompanyProfile } from "mobile/src/graphql/query/company/useCompany";
import { MediaType } from "backend/graphql/mutations.graphql";
import { useUpdateCompanyProfile } from "mobile/src/graphql/mutation/account";

interface PhotoUploadProps {
  show: boolean;
  onClose: () => void;
  type: MediaType;
  company: CompanyProfile;
}

const PhotoUploadModal: FC<PhotoUploadProps> = ({
  show,
  onClose,
  type,
  company,
}: PhotoUploadProps) => {
  const { data: accountData } = useAccount();
  const [fetchUploadLink] = useFetchUploadLink();
  const [updateCompanyProfile] = useUpdateCompanyProfile();

  const selectedFile = useRef<File | undefined>(undefined);
  const [localFileUrl, setLocalFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (accountData?.account) {
    }
  }, [accountData?.account]);

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
          _id: company._id,
          avatar: remoteName,
          name: company.name,
        };
        await updateCompanyProfile({
          variables: {
            profile,
          },
        });
      }

      if (type === "BACKGROUND") {
        const profile = {
          _id: company._id,
          name: company.name,
          background: {
            url: remoteName,
            width: 500,
            height: 200,
            x: 0,
            y: 0,
            scale: 2,
          },
        };
        await updateCompanyProfile({
          variables: {
            profile,
          },
        });
      }
      setLocalFileUrl(null);
      onClose();
    } catch (err) {
      console.log("Error fetching upload link", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={show} onClose={onClose} className="fixed z-10 inset-0">
        <div className="flex items-center justify-center h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          <Card className="flex flex-col border-0 mx-auto p-0 z-10 w-full max-w-2xl h-auto max-h-full">
            <div className="flex justify-between items-center border-b  px-4 py-2">
              <div className="text-sm text-white opacity-60 font-medium tracking-widest">
                {type === "AVATAR" ? "Profile Photo" : "Cover Photo"}
              </div>
              <Button
                variant="text"
                className="text-white opacity-60"
                onClick={onClose}
              >
                <X color="white" weight="bold" size={24} />
              </Button>
            </div>
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
                className="w-full md:w-48 uppercase text-primary"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="gradient-primary"
                className="w-full md:w-48 uppercase leading-6"
                disabled={loading}
                loading={loading}
                onClick={uploadMedia}
              >
                Save
              </Button>
            </div>
          </Card>
        </div>
      </Dialog>
    </>
  );
};

export default PhotoUploadModal;

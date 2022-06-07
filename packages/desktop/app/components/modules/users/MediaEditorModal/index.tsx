import React, { FC, useState } from "react";
import ModalDialog from "../../../common/ModalDialog";
import { DialogProps } from "../../../../types/common-props";
import Button from "../../../common/Button";
import { MediaType } from "backend/graphql/mutations.graphql";
import { useFetchUploadLink } from "shared/graphql/mutation/posts";
import { useAccountContext } from "shared/context/Account";
import {
  useUpdateCompanyProfile,
  useUpdateUserProfile
} from "shared/graphql/mutation/account";
import { UserProfile } from "shared/graphql/query/user/useProfile";
import AvatarEditor from "./AvatarEditor";
import BackgroundEditor from "./BackgroundEditor";

export type User = Pick<
  UserProfile,
  "_id" | "avatar" | "firstName" | "lastName" | "background"
>;
export type Company = Pick<
  Exclude<UserProfile["company"], undefined>,
  "_id" | "name" | "avatar" | "background"
>;

interface MediaEditorModalProps extends DialogProps {
  user?: User;
  company?: Company;
  mediaType: MediaType;
}

const MediaEditorModal: FC<MediaEditorModalProps> = ({
  user,
  company,
  mediaType,
  show,
  onClose,
}) => {
  const account = useAccountContext();
  const [fetchUploadLink] = useFetchUploadLink();
  const [updateUserProfile] = useUpdateUserProfile();
  const [updateCompanyProfile] = useUpdateCompanyProfile();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [loading, setLoading] = useState(false);
  const uploadMedia = async () => {
    setLoading(true);
    const { data } = await fetchUploadLink({
      variables: {
        localFilename: selectedFile!.name,
        type: mediaType,
        id: account._id,
      },
    });
    if (!data?.uploadLink) {
      console.log("Failed to upload file");
      return;
    }
    const { remoteName, uploadUrl } = data.uploadLink;
    await fetch(uploadUrl, {
      method: "PUT",
      body: selectedFile,
    });
    if (mediaType == "AVATAR") {
      if (user) {
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
      } else if (company) {
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
    } else if (mediaType == "BACKGROUND") {
      if (user) {
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
      } else if (company) {
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
    }
    setLoading(false);
  };
  return (
    <>
      <ModalDialog
        title={mediaType == "AVATAR" ? "Profile Photo" : "Cover Photo"}
        className={`${mediaType == "AVATAR" ? "max-w-2xl" : ""} ${
          mediaType == "BACKGROUND" ? "w-full max-w-4xl" : ""
        }`}
        show={show}
        onClose={onClose}
      >
        <div className="px-6 py-5">
          {mediaType == "AVATAR" && (
            <AvatarEditor
              user={user}
              company={company}
              file={selectedFile}
              onFilePick={setSelectedFile}
            />
          )}
          {mediaType == "BACKGROUND" && (
            <BackgroundEditor
              user={user}
              company={company}
              file={selectedFile}
              onFilePick={setSelectedFile}
            />
          )}
        </div>
        <div className="flex items-center justify-between border-t border-white/[.12] px-6 py-3">
          <Button
            type="button"
            variant="text"
            className="text-sm text-primary font-medium"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="gradient-primary"
            className="w-24 text-sm text-white font-medium"
            disabled={loading || !selectedFile}
            loading={loading}
            onClick={uploadMedia}
          >
            Save
          </Button>
        </div>
      </ModalDialog>
    </>
  );
};

export default MediaEditorModal;

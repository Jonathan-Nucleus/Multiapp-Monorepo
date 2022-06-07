import React, { ChangeEvent, FC, useMemo } from "react";
import Image from "next/image";
import Label from "../../../../common/Label";
import { Trash, UploadSimple } from "phosphor-react";
import Input from "../../../../common/Input";
import Button from "../../../../common/Button";
import { Company, User } from "..";
import getConfig from "next/config";

const {
  publicRuntimeConfig: { NEXT_PUBLIC_AWS_BUCKET },
} = getConfig();

export interface AvatarEditorProps {
  user?: User;
  company?: Company;
  file?: File;
  onFilePick: (file?: File) => void;
}

const AvatarEditor: FC<AvatarEditorProps> = ({
  user,
  company,
  file,
  onFilePick,
}) => {
  const avatar = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    } else if (user) {
      return `${NEXT_PUBLIC_AWS_BUCKET}/avatars/${user._id}/${user.avatar}`;
    } else if (company) {
      return `${NEXT_PUBLIC_AWS_BUCKET}/avatars/${company._id}/${company.avatar}`;
    } else {
      return undefined;
    }
  }, [file, user, company]);
  const initials = user
    ? user.firstName.charAt(0) + user.lastName.charAt(0)
    : company?.name.charAt(0) ?? "";
  return (
    <>
      <div className="flex items-center">
        <div
          className={`w-60 h-60 flex items-center justify-center bg-primary-light ${
            user ? "rounded-full" : "rounded-2xl"
          } overflow-hidden relative`}
        >
          {avatar && (
            <Image
              src={avatar}
              alt=""
              width={240}
              height={240}
              objectFit="cover"
              unoptimized={true}
            />
          )}
          {!avatar && (
            <div className="text-9xl text-primary-medium font-semibold select-none">
              {initials}
            </div>
          )}
        </div>
        <Label className="ml-5">
          <div className="flex items-center border border-primary-solid bg-primary-solid/[.24] hover:bg-primary/[.12] cursor-pointer rounded-full px-4 py-2">
            <UploadSimple size={24} color="white" />
            <div className="text-sm font-semibold text-white ml-1">
              Upload New Photo
            </div>
          </div>
          <Input
            type="file"
            value=""
            onInput={(event: ChangeEvent<HTMLInputElement>) => {
              onFilePick(event.target.files?.[0]);
            }}
            accept="image/*"
            className="hidden"
          />
        </Label>
        <Button
          variant="outline-primary"
          className="w-10 h-10 text-white rounded-full ml-4 !p-0"
          disabled={true}
        >
          <Trash size={24} color="currentColor" weight="bold" />
        </Button>
      </div>
    </>
  );
};

export default AvatarEditor;

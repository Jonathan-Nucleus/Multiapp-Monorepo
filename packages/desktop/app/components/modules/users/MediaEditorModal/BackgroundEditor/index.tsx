import React, { ChangeEvent, FC, useMemo } from "react";
import { AvatarEditorProps } from "../AvatarEditor";
import Image from "next/image";
import Label from "../../../../common/Label";
import { UploadSimple } from "phosphor-react";
import Input from "../../../../common/Input";
import getConfig from "next/config";

const {
  publicRuntimeConfig: { NEXT_PUBLIC_AWS_BUCKET },
} = getConfig();

const BackgroundEditor: FC<AvatarEditorProps> = ({
  user,
  company,
  file,
  onFilePick,
}) => {
  const avatar = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    } else if (user) {
      return `${NEXT_PUBLIC_AWS_BUCKET}/backgrounds/${user._id}/${user.background}`;
    } else if (company) {
      return `${NEXT_PUBLIC_AWS_BUCKET}/avatars/${company._id}/${company.background}`;
    } else {
      return undefined;
    }
  }, [file, user, company]);
  return (
    <>
      <div>
        <div className="flex h-32 bg-gradient-to-r from-[#844AFF] to-primary rounded-t-2xl overflow-hidden relative">
          {avatar && (
            <Image
              src={avatar}
              alt=""
              layout="fill"
              objectFit="cover"
              unoptimized={true}
            />
          )}
        </div>
        <div className="text-center mt-6 mb-2">
          <Label>
            <div className="inline-flex items-center border border-primary-solid bg-primary-solid/[.24] hover:bg-primary/[.12] cursor-pointer rounded-full px-4 py-2">
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
        </div>
      </div>
    </>
  );
};

export default BackgroundEditor;

import getConfig from "next/config";
import { Attachment as AttachmentType } from "shared/graphql/fragments/post";
import { FC } from "react";
import Media from "../../../common/Media";

const { publicRuntimeConfig } = getConfig();
const { NEXT_PUBLIC_AWS_BUCKET } = publicRuntimeConfig;

interface PostAttachmentProps {
  userId: string;
  postId?: string;
  attachment: AttachmentType;
  multiple?: boolean;
  aspectRatio?: number;
  maxHeight?: number;
}

const PostAttachment: FC<PostAttachmentProps> = ({
  userId,
  attachment,
  postId,
  multiple,
  aspectRatio,
  maxHeight,
}) => {
  const key = postId ? `${postId}/${attachment.url}` : `${attachment.url}`;
  const url = `${NEXT_PUBLIC_AWS_BUCKET}/posts/${userId}/${key}`;
  const documentLink = attachment.documentLink
    ? `${NEXT_PUBLIC_AWS_BUCKET}/posts/${userId}/${attachment.documentLink}`
    : undefined;
  return (
    <Media
      url={url}
      aspectRatio={aspectRatio ?? (multiple ? 1 : attachment.aspectRatio)}
      documentLink={documentLink}
      multiple={multiple}
      maxHeight={maxHeight}
    />
  );
};

export default PostAttachment;

import { FC, useMemo, useState } from "react";

import Button from "../../../../common/Button";
import Media from "../../../../common/Media";
import PostAttachment from "../../PostAttachment";
import Spinner from "../../../../common/Spinner";
import { XCircle } from "phosphor-react";

import { Attachment as PostAttachmentType } from "shared/graphql/fragments/post";
import { MediaType } from "shared/src/media";

interface AttachmentPreviewProps {
  attachment?: PostAttachmentType;
  file?: File;
  postId?: string;
  userId: string;
  percent?: number;
  removable?: boolean;
  maxHeight?: number;
  className?: string;
  secondary?: boolean;
  onLoaded: (aspectRatio: number) => void;
  onRemove: () => void;
}

const AttachmentPreview: FC<AttachmentPreviewProps> = ({
  attachment,
  file,
  userId,
  postId,
  percent,
  removable = true,
  maxHeight,
  onLoaded,
  onRemove,
  secondary = false,
}) => {
  const filePreview = useMemo<{ type: MediaType; url: string } | null>(() => {
    if (file) {
      return {
        type: file.type.startsWith("video/") ? "video" : "image",
        url: URL.createObjectURL(file),
      };
    } else {
      return null;
    }
  }, [file]);
  const [aspectRatio, setAspectRatio] = useState(
    attachment?.aspectRatio ?? 0.5
  );
  return (
    <>
      {(filePreview || attachment) && (
        <div className="h-full">
          <div className="relative rounded-lg h-full">
            <div className={"overflow-hidden rounded-lg"}>
              {filePreview && (
                <Media
                  type={filePreview.type}
                  url={filePreview.url}
                  aspectRatio={aspectRatio}
                  maxHeight={maxHeight}
                  onLoad={(aspectRatio) => {
                    URL.revokeObjectURL(filePreview.url);
                    setAspectRatio(aspectRatio);
                    onLoaded(aspectRatio);
                  }}
                />
              )}
              {!filePreview && attachment && (
                <PostAttachment
                  userId={userId}
                  attachment={attachment}
                  postId={postId}
                  maxHeight={maxHeight}
                />
              )}
            </div>
            {percent != undefined && (
              <div className="absolute inset-0 bg-black/[.87] flex items-center justify-center">
                <Spinner indeterminate={false} percent={percent} size={40} />
              </div>
            )}
            {removable && (
              <Button
                variant="text"
                className={`!absolute ${
                  secondary ? "top-0.5 -right-10" : "top-2 right-1"
                } py-0`}
                onClick={onRemove}
              >
                <XCircle
                  size={32}
                  color={secondary ? "white" : "#5F5F5F"}
                  weight={secondary ? "regular" : "fill"}
                />
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AttachmentPreview;

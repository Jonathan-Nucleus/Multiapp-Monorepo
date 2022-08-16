import { FC, useMemo, useState } from "react";

import Button from "../../../../common/Button";
import Media from "../../../../common/Media";
import PostMedia from "../../PostMedia";
import Spinner from "../../../../common/Spinner";
import { XCircle } from "phosphor-react";

import { Media as PostMediaType } from "shared/graphql/fragments/post";
import { MediaType } from "shared/src/media";

interface MediaPreviewProps {
  media?: PostMediaType;
  file?: File;
  postId?: string;
  userId: string;
  percent?: number;
  removable?: boolean;
  maxHeight?: number;
  className?: string;
  onLoaded: (aspectRatio: number) => void;
  onRemove: () => void;
}

const MediaPreview: FC<MediaPreviewProps> = ({
  media,
  file,
  userId,
  postId,
  percent,
  removable = true,
  maxHeight,
  onLoaded,
  onRemove,
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
  const [aspectRatio, setAspectRatio] = useState(media?.aspectRatio ?? 0.5);
  return (
    <>
      {(filePreview || media) && (
        <div className="h-full">
          <div className="relative rounded-lg overflow-hidden h-full">
            <>
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
              {!filePreview && media && (
                <PostMedia userId={userId} media={media} postId={postId} />
              )}
            </>
            {percent != undefined && (
              <div className="absolute inset-0 bg-black/[.87] flex items-center justify-center">
                <Spinner indeterminate={false} percent={percent} size={40} />
              </div>
            )}
            {removable && (
              <Button
                variant="text"
                className="!absolute top-2 right-1 py-0"
                onClick={onRemove}
              >
                <XCircle size={32} color="#5F5F5F" weight="fill" />
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MediaPreview;

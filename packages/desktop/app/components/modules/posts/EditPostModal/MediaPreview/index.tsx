import { FC, useMemo, useState } from "react";
import { Media as PostMediaType } from "shared/graphql/fragments/post";
import { MediaType } from "shared/src/media";
import Media from "../../../../common/Media";
import PostMedia from "../../PostMedia";
import Button from "../../../../common/Button";
import { XCircle } from "phosphor-react";

interface MediaPreviewProps {
  media?: PostMediaType;
  file?: File;
  postId?: string;
  userId: string;
  onLoaded: (aspectRatio: number) => void;
  onRemove: () => void;
}

const MediaPreview: FC<MediaPreviewProps> = ({
  media,
  file,
  userId,
  postId,
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
        <div className="my-2">
          <div className="relative rounded-lg overflow-hidden">
            <>
              {filePreview && (
                <Media
                  type={filePreview.type}
                  url={filePreview.url}
                  aspectRatio={aspectRatio}
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
            <Button
              variant="text"
              className="absolute top-2 right-1 py-0"
              onClick={onRemove}
            >
              <XCircle size={32} color="#5F5F5F" weight="fill" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default MediaPreview;

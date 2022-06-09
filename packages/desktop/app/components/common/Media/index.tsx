import { FC } from "react";
import Image from "next/image";
import { getMediaTypeFrom, MediaType } from "shared/src/media";

interface MediaProps {
  url: string;
  type?: MediaType;
  aspectRatio?: number;
  onLoad?: (aspectRatio: number) => void;
}

const Media: FC<MediaProps> = ({
  url,
  type: mediaType = getMediaTypeFrom(url),
  aspectRatio: ratioValue,
  onLoad,
}) => {
  const maxHeight = 700;
  // When ratio value is invalid, use aspect square instead
  const aspectRatio = ratioValue != 0 ? ratioValue : 1;
  return (
    <div className="bg-black relative">
      {mediaType == "video" && (
        <div
          className={`mx-auto max-h[${maxHeight}] ${
            aspectRatio ? `aspect-[${aspectRatio}]` : ""
          }`}
        >
          <video
            controls
            className="w-full"
            onLoadedMetadata={(data) => {
              const target = data.currentTarget;
              onLoad?.(target.videoWidth / target.videoHeight);
            }}
          >
            <source src={url} />
          </video>
        </div>
      )}
      {mediaType == "image" && (
        <div
          style={
            aspectRatio ? { maxWidth: `${maxHeight * aspectRatio}px` } : {}
          }
          className="mx-auto"
        >
          <div
            style={
              aspectRatio ? { paddingBottom: `${100 / aspectRatio}%` } : {}
            }
            className="relative"
          >
            <div className="absolute inset-0">
              <Image
                loader={() => url}
                src={url}
                alt=""
                layout="fill"
                unoptimized={true}
                objectFit="contain"
                onLoadingComplete={({ naturalWidth, naturalHeight }) => {
                  onLoad?.(naturalWidth / naturalHeight);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Media;

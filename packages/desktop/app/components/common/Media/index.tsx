import { FC } from "react";
import Image from "next/image";
import { getMediaTypeFrom, MediaType } from "shared/src/media";

interface MediaProps {
  url: string;
  type?: MediaType;
  aspectRatio?: number;
  controls?: boolean;
  onLoad?: (aspectRatio: number) => void;
  documentLink?: string;
}

const Media: FC<MediaProps> = ({
  url,
  type: mediaType = getMediaTypeFrom(url),
  aspectRatio: ratioValue,
  controls = true,
  onLoad,
  documentLink,
}) => {
  const maxHeight = 700;
  const aspectRatio = ratioValue != 0 ? ratioValue : 1;

  const openDocument = (): void => {
    if (!documentLink) return;
    const newWindow = window.open();
    if (newWindow) {
      newWindow.location.href = documentLink;
    }
  };

  return (
    <div className="bg-black relative">
      {mediaType == "video" && (
        <div
          className={`mx-auto max-h[${maxHeight}] ${
            aspectRatio ? `aspect-[${aspectRatio}]` : ""
          }`}
        >
          <video
            className="w-full"
            controls={controls}
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
            className={`relative ${documentLink ? "cursor-pointer" : ""}`}
            onClick={openDocument}
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
              {documentLink && (
                <div className="bg-black/[0.8] text-white absolute top-4 right-4 px-4 py-2 rounded-md">
                  PDF
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Media;

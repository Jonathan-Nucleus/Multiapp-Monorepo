import { FC, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getMediaTypeFrom, MediaType } from "shared/src/media";
import { useInView } from "react-intersection-observer";

interface MediaProps {
  url: string;
  type?: MediaType;
  aspectRatio?: number;
  hideControls?: boolean;
  maxHeight?: number;
  multiple?: boolean;
  onLoad?: (aspectRatio: number) => void;
  documentLink?: string;
}

const Media: FC<MediaProps> = ({
  url,
  type: mediaType = getMediaTypeFrom(url),
  aspectRatio: ratioValue,
  hideControls,
  maxHeight = 700,
  multiple = false,
  onLoad,
  documentLink,
}) => {
  const aspectRatio = ratioValue !== 0 ? ratioValue : 1;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoPaused, setVideoPaused] = useState(false);
  const { ref: inViewRef, inView: isVideoInView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!isVideoInView) {
      if (video) {
        const isPlaying =
          video.currentTime > 0 &&
          !video.paused &&
          !video.ended &&
          video.readyState > 2;
        if (isPlaying) {
          video.pause();
          setVideoPaused(true);
        }
      }
    } else if (videoPaused) {
      video?.play().then();
      setVideoPaused(false);
    }
  }, [isVideoInView, videoPaused]);

  const openDocument = (): void => {
    if (!documentLink) return;
    const newWindow = window.open();
    if (newWindow) {
      newWindow.location.href = documentLink;
    }
  };

  return (
    <div className={`bg-black relative h-full ${multiple ? "rounded-lg" : ""}`}>
      {mediaType == "video" && (
        <div
          className={`mx-auto h-full max-h[${maxHeight}] ${
            aspectRatio ? `aspect-[${aspectRatio}]` : ""
          }`}
        >
          <video
            ref={(element) => {
              inViewRef(element);
              videoRef.current = element;
            }}
            className="w-full h-full"
            controls={!hideControls}
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
          className="mx-auto h-full"
        >
          <div
            style={
              aspectRatio ? { paddingBottom: `${100 / aspectRatio}%` } : {}
            }
            className={`relative w-full h-full ${
              documentLink ? "cursor-pointer" : ""
            }`}
            onClick={openDocument}
          >
            <div className="absolute inset-0">
              <Image
                loader={() => url}
                src={url}
                alt=""
                className={aspectRatio === 1 && multiple ? "rounded-lg" : ""}
                layout="fill"
                unoptimized={true}
                objectFit={multiple ? "cover" : "contain"}
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

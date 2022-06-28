import { FC } from "react";
import Image from "next/image";
import { LinkPreview as LinkPreviewResponse } from "shared/graphql/query/post/useLinkPreview";

interface LinkPreviewProps {
  previewData: LinkPreviewResponse;
}

const LinkPreview: FC<LinkPreviewProps> = ({
  previewData,
}: LinkPreviewProps) => {
  const previewImage = previewData.images?.find((image) => !!image);
  const previewFavicon = previewData.favicons?.find((image) => !!image);

  return (
    <div>
      <div className="flex items-center relative pb-1">
        <div className="w-4 h-4 flex items-center flex-shrink-0">
          {previewFavicon && (
            <Image
              loader={() => previewFavicon}
              src={previewFavicon}
              alt=""
              width={16}
              height={16}
              unoptimized={true}
              objectFit="cover"
            />
          )}
        </div>
        <div className="text-sm text-white flex-grow truncate mx-2 pr-3">
          <a href={previewData.url} target="_blank" rel="noopener noreferrer">
            {previewData.title}
          </a>
        </div>
      </div>
      <a
        href={previewData.url}
        className="block"
        target="_blank"
        rel="noopener noreferrer"
      >
        {previewImage && (
          <div className="w-full aspect-video relative">
            <Image
              loader={() => previewImage}
              src={previewImage}
              alt=""
              layout="fill"
              objectFit="cover"
              unoptimized={true}
              priority={false}
              className="rounded"
            />
          </div>
        )}
        {!previewFavicon && !previewImage && (
          <div className="text-sm text-center text-gray-400">
            Preview not available
          </div>
        )}
      </a>
    </div>
  );
};

export default LinkPreview;

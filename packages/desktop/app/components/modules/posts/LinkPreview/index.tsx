import { FC, Fragment, useEffect, useState } from "react";
import Spinner from "../../../common/Spinner";
import Image from "next/image";
import { SiteMetadata } from "../../../../../pages/api/scrap";
import { Transition } from "@headlessui/react";
import Button from "../../../common/Button";
import { CaretDown, CaretUp } from "phosphor-react";
import Link from "next/link";

interface LinkPreviewProps {
  link: string;
}

const LinkPreview: FC<LinkPreviewProps> = ({ link }: LinkPreviewProps) => {
  const [preview, setPreview] = useState<SiteMetadata>();
  const [loading, setLoading] = useState(false);
  const [showImage, setShowImage] = useState(true);
  useEffect(() => {
    const fetchPreview = async (link: string) => {
      setLoading(true);
      const response = await fetch("/api/scrap", {
        method: "POST",
        body: JSON.stringify({ url: link }),
      });
      const json = await response.json();
      setPreview(json);
      setLoading(false);
    };
    fetchPreview(link).then();
  }, [link]);
  return (
    <>
      <div className="border-l-2 border-primary pl-2">
        {loading && <Spinner />}
        {!loading && preview && (
          <>
            <div className="flex items-center relative pb-1">
              <div className="w-4 h-4 flex items-center flex-shrink-0">
                {preview.logo && (
                  <Image
                    loader={() => preview.logo!}
                    src={preview.logo}
                    alt=""
                    width={16}
                    height={16}
                    unoptimized={true}
                    objectFit="cover"
                  />
                )}
              </div>
              <div className="text-sm text-white flex-grow truncate mx-2 pr-3">
                <Link href={link}>
                  <a target="_blank" rel="noopener noreferrer">
                    {preview.title}
                  </a>
                </Link>
              </div>
              <div className="flex ml-auto">
                <Button
                  variant="text"
                  className="py-0"
                  onClick={() => setShowImage(!showImage)}
                >
                  {showImage ? (
                    <CaretDown
                      size={16}
                      weight="bold"
                      color="currentColor"
                      className="text-white"
                    />
                  ) : (
                    <CaretUp
                      size={16}
                      weight="bold"
                      color="currentColor"
                      className="text-white"
                    />
                  )}
                </Button>
              </div>
            </div>
            <Transition
              show={showImage}
              as={Fragment}
              enter="transition duration-300"
              enterFrom="opacity-0 h-0"
              enterTo="opacity-100 h-full"
              leave="transition duration-300"
              leaveFrom="opacity-100 h-full"
              leaveTo="opacity-0 h-0"
            >
              <div className="">
                <div className="items-center justify-center">
                  {preview.image && (
                    <Link href={link}>
                      <a target="_blank" rel="noopener noreferrer">
                        <Image
                          loader={() => preview.image!}
                          src={preview.image}
                          alt=""
                          width={161}
                          height={100}
                          layout="responsive"
                          sizes="50vw"
                          objectFit="cover"
                          unoptimized={true}
                          className="rounded"
                        />
                      </a>
                    </Link>
                  )}
                  {!preview.image && (
                    <div className="text-sm text-center text-gray-400">
                      Preview not available
                    </div>
                  )}
                </div>
              </div>
            </Transition>
          </>
        )}
      </div>
    </>
  );
};

export default LinkPreview;

import React, {
  CSSProperties,
  FC,
  Fragment,
  useCallback,
  useState,
} from "react";
import { Transition } from "@headlessui/react";
import { CaretLeft, CaretRight, X } from "phosphor-react";
import { Attachment } from "shared/graphql/fragments/post";
import Button from "../../../common/Button";
import PostAttachment from "../PostAttachment";

interface GalleryViewProps {
  show: boolean;
  postId: string;
  userId: string;
  images: Attachment[];
  index: number;
  onClose: () => void;
}

const GalleryView: FC<GalleryViewProps> = ({
  show,
  postId,
  userId,
  images,
  index,
  onClose,
}) => {
  const [activeIndex, setActiveIndex] = useState(index);
  const onContainerRender = useCallback(
    (node: HTMLDivElement | null) => {
      if (node != null) {
        const bottomLabelBarHeight = images.length > 1 ? 48 : 0;
        const aspectRatio = images[activeIndex].aspectRatio;
        const originHeight = node.offsetHeight - bottomLabelBarHeight;
        const originWidth = originHeight * aspectRatio;
        const scaleRatio = Math.min(1, node.offsetWidth / originWidth);
        const targetWidth = originWidth * scaleRatio;
        const targetHeight = originHeight * scaleRatio;
        setStyles({
          width: `${targetWidth}px`,
          height: `${targetHeight}px`,
        });
      }
    },
    [activeIndex, images]
  );
  const [styles, setStyles] = useState<CSSProperties>();
  return (
    <>
      <Transition appear show={show}>
        <Transition.Child
          enter="transition-opacity ease-linear duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black opacity-70 z-20" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 overflow-auto z-20">
            <div className="h-full flex flex-col py-6">
              <div className="flex-grow min-h-0 flex items-center">
                <div className="px-2 md:px-6">
                  <Button
                    variant="text"
                    className={`w-12 h-12 bg-gray-800 rounded-full p-0 ${
                      activeIndex == 0 ? "invisible" : ""
                    }`}
                    onClick={() => setActiveIndex(activeIndex - 1)}
                  >
                    <CaretLeft
                      size={24}
                      color="currentColor"
                      weight="bold"
                      className="text-white"
                    />
                  </Button>
                </div>
                <div
                  ref={onContainerRender}
                  className="flex-grow min-w-0 h-full flex flex-col items-center justify-center"
                >
                  <div className="w-full max-h-full">
                    <div style={styles} className="mx-auto">
                      <PostAttachment
                        postId={postId}
                        userId={userId}
                        attachment={images[activeIndex]}
                        maxHeight={2000}
                      />
                    </div>
                    {images.length > 1 && (
                      <div
                        className="bg-black rounded-b-2xl text-xs text-white mx-auto p-4"
                        style={styles ? { width: styles.width } : undefined}
                      >
                        Image {activeIndex + 1} of {images.length}
                      </div>
                    )}
                  </div>
                </div>
                <div className="px-2 md:px-6">
                  <Button
                    variant="text"
                    className={`w-12 h-12 bg-gray-800 rounded-full p-0 ${
                      activeIndex == images.length - 1 ? "invisible" : ""
                    }`}
                    onClick={() => setActiveIndex(activeIndex + 1)}
                  >
                    <CaretRight
                      size={24}
                      color="currentColor"
                      weight="bold"
                      className="text-white"
                    />
                  </Button>
                  <div className="absolute top-4 right-4">
                    <Button variant="text" className="!p-0" onClick={onClose}>
                      <X
                        size={24}
                        color="currentColor"
                        weight="bold"
                        className="text-white m-5"
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition.Child>
      </Transition>
    </>
  );
};

export default GalleryView;

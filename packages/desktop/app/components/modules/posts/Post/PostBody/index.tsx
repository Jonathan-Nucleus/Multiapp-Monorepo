import { FC, useMemo, useState } from "react";
import LinkPreview from "../../LinkPreview";
import PostAttachment from "../../PostAttachment";
import { Post as PostType } from "shared/graphql/query/post/usePosts";
import Post from "..";
import BodyText from "./BodyText";
import GalleryView from "../../GalleryView";
import { getMediaTypeFrom } from "shared/src/media";
import { logEvent } from "../../../../../lib/ga";

interface PostBodyProps {
  post: PostType;
  isPreview?: boolean;
}

const PostBody: FC<PostBodyProps> = ({
  post,
  isPreview = false,
}: PostBodyProps) => {
  const [galleryIndex, setGalleryIndex] = useState<number>();
  const postImages = useMemo(() => {
    return (
      post.attachments?.filter(
        (item) => getMediaTypeFrom(item.url) == "image"
      ) ?? []
    );
  }, [post.attachments]);
  const handleGalleryIndex = (idx: number | undefined) => {
    setGalleryIndex(idx);
    if (post && post.attachments && idx !== undefined) {
      logEvent({
        action: "enlarge_photo",
        params: {
          event_category: "Enlarge Photo In Post",
          event_label: "Button Clicked",
          value: post.attachments[idx].url,
          author: `${post.user?.firstName} ${post.user?.lastName}`,
          id: post._id,
        },
      });
    }
  };
  return (
    <>
      <div className="px-4">
        <div className="pb-2">
          {post.body && <BodyText text={post.body ?? ""} post={post} />}
        </div>
        {post.preview &&
          (!post.attachments ||
            (post.attachments && post.attachments.length === 0)) &&
          !post.sharedPost && (
            <div className="my-4">
              <LinkPreview previewData={post.preview} />
            </div>
          )}
      </div>
      {post.attachments && post.attachments.length > 0 && (
        <div
          className={`mt-5 border-b border-white/[.12] grid gap-2 ${
            post.attachments.length > 1 ? "mx-2 grid-cols-2" : "grid-cols-1"
          }`}
        >
          {post.attachments.slice(0, 2).map((attachment, index) => (
            <div
              key={index}
              className="cursor-pointer"
              onClick={() => handleGalleryIndex(index)}
            >
              <PostAttachment
                attachment={attachment}
                userId={post.userId}
                postId={post._id}
                multiple={post.attachments!.length > 1}
              />
            </div>
          ))}
        </div>
      )}
      {post.attachments && post.attachments.length > 2 && (
        <div
          className={`m-2 border-b border-white/[.12] grid gap-2 ${
            post.attachments.length === 4 ? "grid-cols-2" : "grid-cols-3"
          }`}
        >
          {post.attachments.slice(2, 5).map((attachment, index) => (
            <div
              key={index}
              className={`${
                post.attachments?.length == 3 ? "col-span-3" : ""
              } cursor-pointer`}
              onClick={() => handleGalleryIndex(index + 2)}
            >
              <PostAttachment
                attachment={attachment}
                userId={post.userId}
                postId={post._id}
                multiple={post.attachments!.length > 1}
              />
            </div>
          ))}
        </div>
      )}
      {galleryIndex != undefined && postImages.length > 0 && (
        <GalleryView
          show={true}
          postId={post._id}
          userId={post.userId}
          images={postImages}
          index={galleryIndex}
          onClose={() => handleGalleryIndex(undefined)}
        />
      )}
      {post.sharedPost && (
        <div className="border border-brand-overlay/[.1] rounded overflow-hidden mx-4 mt-4">
          <Post
            post={post.sharedPost}
            isPreview={true}
            className="shadow-none"
          />
        </div>
      )}
      {!isPreview && (
        <div className="uppercase text-xs text-white font-medium opacity-60 mt-3 px-4">
          {post.categories.join(" • ")}
        </div>
      )}
    </>
  );
};

export default PostBody;

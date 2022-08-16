import { FC } from "react";
import LinkPreview from "../../LinkPreview";
import PostMedia from "../../PostMedia";
import { Post as PostType } from "shared/graphql/query/post/usePosts";
import Post from "..";
import BodyText from "./BodyText";

interface PostBodyProps {
  post: PostType;
  isPreview?: boolean;
}

const PostBody: FC<PostBodyProps> = ({
  post,
  isPreview = false,
}: PostBodyProps) => {
  return (
    <>
      <div className="px-4">
        <div className="pb-2">
          {post.body && <BodyText text={post.body ?? ""} />}
        </div>
        {post.preview &&
          (!post.media || (post.media && post.media.length === 0)) &&
          !post.sharedPost && (
            <div className="my-4">
              <LinkPreview previewData={post.preview} />
            </div>
          )}
      </div>
      {post.media && post.media.length > 0 && (
        <div
          className={`mt-5 border-b border-white/[.12] grid gap-2 ${
            post.media.length > 1 ? "mx-2 grid-cols-2" : "grid-cols-1"
          }`}
        >
          {post.media.slice(0, 2).map((media, index) => (
            <div key={index}>
              <PostMedia
                media={media}
                userId={post.userId}
                postId={post._id}
                multiple={post.media && post.media?.length > 1}
              />
            </div>
          ))}
        </div>
      )}
      {post.media && post.media.length > 2 && (
        <div
          className={`m-2 border-b border-white/[.12] grid gap-2 ${
            post.media.length === 4 ? "grid-cols-2" : "grid-cols-3"
          }`}
        >
          {post.media.slice(2, 5).map((media, index) => (
            <div
              key={index}
              className={`${post.media?.length === 3 ? "col-span-3" : ""}`}
            >
              <PostMedia
                media={media}
                userId={post.userId}
                postId={post._id}
                multiple={post.media && post.media?.length > 1}
                aspectRatio={post.media?.length === 3 ? 3 : undefined}
              />
            </div>
          ))}
        </div>
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

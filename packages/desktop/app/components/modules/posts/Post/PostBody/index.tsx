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
        {post.preview && !post.media && !post.sharedPost && (
          <div className="my-4">
            <LinkPreview previewData={post.preview} />
          </div>
        )}
      </div>
      {post.media && (
        <div className="relative h-auto mt-5 border-b border-white/[.12]">
          <PostMedia
            media={post.media}
            userId={post.userId}
            postId={post._id}
          />
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

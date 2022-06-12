import { FC } from "react";
import { Post as PostType } from "shared/graphql/query/post/usePost";
import Post from "../../modules/posts/Post";
import PostSkeleton from "desktop/app/components/modules/posts/Post/Skeleton";

interface PostPageProps {
  post?: PostType;
}

const PostPage: FC<PostPageProps> = ({ post }) => {
  return (
    <>
      <div className="max-w-2xl mx-auto my-8">
        {!post && <PostSkeleton />}
        {post && <Post post={post} />}
      </div>
    </>
  );
};

export default PostPage;

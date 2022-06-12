import { FC, useState } from "react";
import Post from "../Post";
import { Post as PostType } from "shared/graphql/query/post/usePosts";
import { PostCategory, PostRoleFilter } from "backend/graphql/posts.graphql";
import PostSkeleton from "desktop/app/components/modules/posts/Post/Skeleton";
import FilterHeader from "./FilterHeader";
import EditPostModal, { PostActionType } from "../EditPostModal";

export type { PostCategory, PostRoleFilter };

interface PostsListProps {
  posts: PostType[] | undefined;
  displayFilter?: boolean;
  onRefresh?: (
    categories: PostCategory[] | undefined,
    filter?: PostRoleFilter
  ) => void;
}

const PostsList: FC<PostsListProps> = ({
  posts,
  displayFilter = true,
  onRefresh,
}) => {
  const [postAction, setPostAction] = useState<PostActionType | undefined>();

  if (!posts) {
    return <PostSkeleton />;
  }

  console.log("Total posts", posts.length);
  return (
    <>
      {displayFilter && (
        <FilterHeader
          onFilterChange={(categories, filter) => {
            onRefresh?.(categories.length > 0 ? categories : undefined, filter);
          }}
        />
      )}
      <div>
        {posts.map((post) => (
          <div key={post._id} className="mt-4 mb-8">
            <Post
              post={post}
              onClickToEdit={() => setPostAction({ type: "edit", post })}
              onClickToShare={() => {
                if (post.sharedPost) {
                  setPostAction({ type: "share", post: post.sharedPost });
                } else {
                  setPostAction({ type: "share", post });
                }
              }}
            />
          </div>
        ))}
      </div>
      {postAction && (
        <EditPostModal
          actionData={postAction}
          show={!!postAction}
          onClose={() => setPostAction(undefined)}
        />
      )}
    </>
  );
};

export default PostsList;

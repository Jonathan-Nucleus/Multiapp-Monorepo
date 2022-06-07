import { FC, useState } from "react";
import Post from "../Post";
import { Post as PostType } from "shared/graphql/query/post/usePosts";
import { PostCategory, PostRoleFilter } from "backend/graphql/posts.graphql";
import Skeleton from "./Skeleton";
import FilterHeader from "./FilterHeader";
import EditPostModal, { PostActionType } from "../EditPostModal";

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
    return <Skeleton />;
  }
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
        {posts.map((post, index) => (
          <div key={index} className="mt-4 mb-8">
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

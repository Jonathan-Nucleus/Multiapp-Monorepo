import { FC, useEffect, useState } from "react";
import Post from "../Post";
import { Post as PostType } from "shared/graphql/query/post/usePosts";
import { PostCategory, PostRoleFilter } from "backend/graphql/posts.graphql";
import PostSkeleton from "desktop/app/components/modules/posts/Post/Skeleton";
import FilterHeader, { FilterSettings } from "./FilterHeader";
import EditPostModal, { PostActionType } from "../EditPostModal";

export type { PostCategory, PostRoleFilter };
interface PostsListProps {
  posts: PostType[] | undefined;
  displayFilter?: boolean;
  initialFilter?: FilterSettings;
  displayBanner?: boolean;
  onFilterChange?: (filterSettings: FilterSettings) => void;
}

const PostsList: FC<PostsListProps> = ({
  posts,
  displayFilter = true,
  initialFilter,
  displayBanner = false,
  onFilterChange,
}) => {
  const [postAction, setPostAction] = useState<PostActionType | undefined>();
  const [lastVideoPostId, setLastVideoPostId] = useState<string | undefined>();

  useEffect(() => {
    if (posts) {
      const lastPost = posts.find(({ _id }) => _id === lastVideoPostId);
      if (lastPost) {
        setLastVideoPostId(undefined);
      }
    }
  }, [lastVideoPostId, posts]);

  const handleCloseModal = (videoPostid?: string) => {
    setPostAction(undefined);
    setLastVideoPostId(videoPostid);
  };

  if (!posts) {
    return <PostSkeleton />;
  }

  return (
    <>
      {displayFilter && initialFilter && (
        <FilterHeader
          initialSettings={initialFilter}
          onFilterChange={onFilterChange}
        />
      )}
      {(lastVideoPostId || displayBanner) && (
        <div className="mt-4 p-3 rounded-lg bg-background-popover">
          <span className="text-white/[0.87] text-sm">
            Your video is processing and will display shortly.
          </span>
        </div>
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
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default PostsList;

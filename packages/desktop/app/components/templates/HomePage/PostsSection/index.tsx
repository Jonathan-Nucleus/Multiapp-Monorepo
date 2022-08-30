import { FC, useEffect, useState, memo } from "react";
import PostsList, {
  PostCategory,
  PostRoleFilter,
} from "../../../modules/posts/PostsList";
import EditPostModal, {
  PostActionType,
} from "../../../modules/posts/EditPostModal";
import AddPost from "./AddPost";
import Button from "../../../common/Button";
import { Plus } from "phosphor-react";
import { usePosts } from "shared/graphql/query/post/usePosts";
import { Account } from "shared/context/Account";
import { usePagination } from "../../../../hooks/usePagination";

const POSTS_PER_SCROLL = 15;

interface PostsSectionProps {
  account: Account;
  onPostsLoaded: () => void;
}

const PostsSection: FC<PostsSectionProps> = ({ account, onPostsLoaded }) => {
  const [categories, setCategories] = useState<PostCategory[]>();
  const [roleFilter, setRoleFilter] = useState<PostRoleFilter>(
    "PROFESSIONAL_FOLLOW"
  );
  const {
    data: { posts } = {},
    fetchMore,
    loading,
  } = usePosts(categories, roleFilter, undefined, POSTS_PER_SCROLL);

  const [postAction, setPostAction] = useState<PostActionType>();
  const [lastVideoPostId, setLastVideoPostId] = useState<string | undefined>();
  usePagination(posts, fetchMore);

  useEffect(() => {
    if (posts) {
      const lastPost = posts.find(({ _id }) => _id === lastVideoPostId);
      if (lastPost) {
        setLastVideoPostId(undefined);
      }
    }
  }, [lastVideoPostId, posts]);

  useEffect(() => {
    if (!loading && posts) {
      onPostsLoaded();
    }
  }, [loading, onPostsLoaded, posts]);

  const handleCloseModal = (postId?: string) => {
    setPostAction(undefined);
    setLastVideoPostId(postId);
  };

  return (
    <>
      <div className="hidden md:block">
        <AddPost
          account={account}
          onClick={(files) => setPostAction({ type: "create", files })}
        />
      </div>
      <div className="mt-8">
        <PostsList
          posts={posts}
          initialFilter={{ categories, roleFilter }}
          displayBanner={!!lastVideoPostId}
          onFilterChange={({
            categories: _categories,
            roleFilter: _roleFilter,
          }) => {
            setCategories(_categories);
            setRoleFilter(_roleFilter);
          }}
        />
      </div>
      <div className="block md:hidden fixed bottom-5 right-5">
        <Button
          variant="gradient-primary"
          className="w-12 h-12 rounded-full"
          onClick={() => setPostAction({ type: "create" })}
        >
          <Plus color="white" size={24} />
        </Button>
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

export default memo(PostsSection);

import { FC, useEffect, useRef, useState, useCallback, memo } from "react";
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
import _ from "lodash";
import { Account } from "shared/context/Account";

const POSTS_PER_SCROLL = 15;
const SCROLL_OFFSET_THRESHOLD = 3000;

interface PostsSectionProps {
  account: Account;
}

const PostsSection: FC<PostsSectionProps> = ({ account }) => {
  const scrollOffset = useRef(0);
  const isFetchingMore = useRef(false);
  const [categories, setCategories] = useState<PostCategory[]>();
  const [roleFilter, setRoleFilter] = useState<PostRoleFilter>(
    "PROFESSIONAL_FOLLOW"
  );
  const { data: { posts } = {}, fetchMore } = usePosts(
    categories,
    roleFilter,
    undefined,
    POSTS_PER_SCROLL
  );
  const triggeredOffset = useRef(false);
  const [postAction, setPostAction] = useState<PostActionType>();

  const onEndReached = useCallback(async () => {
    if (isFetchingMore.current) return;

    isFetchingMore.current = true;
    const lastItem = _.last(posts)?._id;
    await fetchMore({
      variables: {
        before: lastItem,
      },
    });
    isFetchingMore.current = false;
  }, [fetchMore, posts]);

  useEffect(() => {
    const handleScroll = (event: Event) => {
      const target = event.target;
      if (
        target &&
        target instanceof HTMLElement &&
        target.id == "app-layout"
      ) {
        if (
          target.clientHeight + target.scrollTop >
            target.scrollHeight - SCROLL_OFFSET_THRESHOLD &&
          !triggeredOffset.current
        ) {
          // Fetch more posts only when scroll down.
          if (target.scrollTop >= scrollOffset.current) {
            triggeredOffset.current = true;
            onEndReached();
          }
        } else {
          triggeredOffset.current = false;
        }

        scrollOffset.current = target.scrollTop;
      }
    };
    document.addEventListener("scroll", handleScroll, true);
    return () => document.removeEventListener("scroll", handleScroll, true);
  }, [onEndReached]);

  return (
    <>
      <div className="hidden md:block">
        <AddPost
          account={account}
          onClick={(file) => setPostAction({ type: "create", file })}
        />
      </div>
      <div className="mt-8">
        <PostsList
          posts={posts}
          initialFilter={{ categories, roleFilter }}
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
          onClose={() => setPostAction(undefined)}
        />
      )}
    </>
  );
};

export default memo(PostsSection);

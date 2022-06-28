import { FC, useEffect, useRef, useState, useCallback, memo } from "react";
import PostsList, {
  PostCategory,
  PostRoleFilter,
} from "../../../modules/posts/PostsList";
import EditPostModal, {
  PostActionType,
} from "../../../modules/posts/EditPostModal";
import AddPost from "./AddPost";
import { UserProfileProps } from "../../../../types/common-props";
import Button from "../../../common/Button";
import { Plus } from "phosphor-react";
import { usePosts } from "shared/graphql/query/post/usePosts";
import _ from "lodash";

const POSTS_PER_SCROLL = 15;
const SCROLL_OFFSET_THRESHOLD = 3000;

const PostsSection: FC<UserProfileProps> = ({ user }) => {
  const scrollOffset = useRef(0);
  const {
    data: { posts } = {},
    refetch,
    fetchMore,
  } = usePosts(undefined, undefined, undefined, POSTS_PER_SCROLL);
  const triggeredOffset = useRef(false);
  const [postAction, setPostAction] = useState<PostActionType>();

  const onEndReached = useCallback(() => {
    const lastItem = _.last(posts)?._id;
    fetchMore({
      variables: {
        before: lastItem,
      },
    });
  }, [fetchMore, posts]);

  const onRefresh = useCallback(
    (categories?: PostCategory[], filter?: PostRoleFilter) =>
      refetch({
        categories,
        roleFilter: filter,
      }),
    [refetch]
  );

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
          user={user}
          onClick={(file) => setPostAction({ type: "create", file })}
        />
      </div>
      <div className="mt-8">
        <PostsList posts={posts} onRefresh={onRefresh} />
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

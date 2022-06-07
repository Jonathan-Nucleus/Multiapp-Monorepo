import { FC, useEffect, useRef, useState } from "react";
import PostsList from "../../../modules/posts/PostsList";
import EditPostModal, {
  PostActionType,
} from "../../../modules/posts/EditPostModal";
import AddPost from "./AddPost";
import { UserProfileProps } from "../../../../types/common-props";
import Button from "../../../common/Button";
import { Plus } from "phosphor-react";
import { Post, usePosts } from "shared/graphql/query/post/usePosts";
import _ from "lodash";
import Spinner from "../../../common/Spinner";

const POSTS_PER_SCROLL = 15;
const SCROLL_OFFSET_THRESHOLD = 100;
const FETCH_DEBOUNCE_INTERVAL = 100;

const PostsSection: FC<UserProfileProps> = ({ user }) => {
  const [limit, setLimit] = useState(POSTS_PER_SCROLL);
  const scrollOffset = useRef(0);
  const {
    data: { posts } = {},
    loading,
    refetch,
    fetchMore,
  } = usePosts(undefined, undefined, undefined, limit);
  const [postAction, setPostAction] = useState<PostActionType>();
  const scrollCallback = useRef(
    _.debounce(async (posts?: Post[]) => {
      const lastItem = _.last(posts)?._id;
      fetchMore({
        variables: {
          before: lastItem,
          limit: POSTS_PER_SCROLL,
        },
      }).then(({ data: { posts: newPosts = [] } }) => {
        setLimit((posts?.length ?? 0) + newPosts.length);
      });
    }, FETCH_DEBOUNCE_INTERVAL)
  ).current;
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
          target.scrollHeight - SCROLL_OFFSET_THRESHOLD
        ) {
          // Fetch more posts only when scroll down.
          if (target.scrollTop >= scrollOffset.current) {
            scrollCallback(posts);
          }
        }
        scrollOffset.current = target.scrollTop;
      }
    };
    document.addEventListener("scroll", handleScroll, true);
    return () => document.removeEventListener("scroll", handleScroll, true);
  }, [posts, scrollCallback]);
  return (
    <>
      <div className="hidden md:block">
        <AddPost
          user={user}
          onClick={(file) => setPostAction({ type: "create", file })}
        />
      </div>
      <div className="mt-8">
        <PostsList
          posts={posts}
          onRefresh={(categories, filter) =>
            refetch({
              categories,
              roleFilter: filter,
            })
          }
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
      {loading && posts && (
        <div className="text-center p-5">
          <Spinner />
        </div>
      )}
    </>
  );
};

export default PostsSection;

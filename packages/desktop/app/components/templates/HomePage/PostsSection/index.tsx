import { FC, useEffect, useRef, useState } from "react";
import { PostSummary } from "shared/graphql/fragments/post";
import PostsList from "../../../modules/posts/PostsList";
import EditPostModal from "../../../modules/posts/EditPostModal";
import AddPost from "../AddPost";
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
  const {
    data: { posts } = {},
    loading,
    refetch,
    fetchMore,
  } = usePosts(undefined, undefined, undefined, limit);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostSummary>();
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
      if (target && target instanceof HTMLElement) {
        if (
          target.clientHeight + target.scrollTop >
          target.scrollHeight - SCROLL_OFFSET_THRESHOLD
        ) {
          scrollCallback(posts);
        }
      }
    };
    document.addEventListener("scroll", handleScroll, true);
    return () => document.removeEventListener("wheel", handleScroll);
  }, [posts, scrollCallback]);
  return (
    <>
      <div className="hidden md:block">
        <AddPost
          user={user}
          onClick={() => {
            setSelectedPost(undefined);
            setShowPostModal(true);
          }}
        />
      </div>
      <div className="mt-8">
        <PostsList
          posts={posts}
          onSelectPost={(post) => {
            setSelectedPost(post);
            setShowPostModal(true);
          }}
          onRefresh={(categories) => refetch({ categories })}
        />
      </div>
      <div className="block md:hidden fixed bottom-5 right-5">
        <Button
          variant="gradient-primary"
          className="w-12 h-12 rounded-full"
          onClick={() => {
            setSelectedPost(undefined);
            setShowPostModal(true);
          }}
        >
          <Plus color="white" size={24} />
        </Button>
      </div>
      {showPostModal && (
        <EditPostModal
          post={selectedPost}
          show={showPostModal}
          onClose={() => setShowPostModal(false)}
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

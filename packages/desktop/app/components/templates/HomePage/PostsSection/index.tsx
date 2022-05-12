import { FC, useState } from "react";
import { PostSummary } from "shared/graphql/fragments/post";
import PostsList from "../../../modules/posts/PostsList";
import EditPostModal from "../../../modules/posts/EditPostModal";
import AddPost from "../AddPost";
import { UserProfileProps } from "../../../../types/common-props";
import Button from "../../../common/Button";
import { Plus } from "phosphor-react";
import { usePosts } from "shared/graphql/query/post/usePosts";

const PostsSection: FC<UserProfileProps> = ({ user }) => {
  const { data: { posts = [] } = {}, refetch } = usePosts();
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostSummary>();
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
    </>
  );
};

export default PostsSection;

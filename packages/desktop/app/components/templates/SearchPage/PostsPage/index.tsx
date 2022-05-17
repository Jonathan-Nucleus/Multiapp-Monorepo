import { FC, useState } from "react";
import { GlobalSearchData } from "shared/graphql/query/search/useGlobalSearch";
import PostsList from "../../../modules/posts/PostsList";
import { PostSummary } from "shared/graphql/fragments/post";
import EditPostModal from "../../../modules/posts/EditPostModal";

interface PostsPageProps {
  posts: GlobalSearchData["globalSearch"]["posts"] | undefined;
}

const PostsPage: FC<PostsPageProps> = ({ posts }) => {
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostSummary>();
  return (
    <div>
      <PostsList
        posts={posts}
        displayFilter={false}
        onSelectPost={(post) => {
          setSelectedPost(post);
          setShowPostModal(true);
        }}
      />
      {showPostModal && (
        <EditPostModal
          post={selectedPost}
          show={showPostModal}
          onClose={() => setShowPostModal(false)}
        />
      )}
    </div>
  );
};

export default PostsPage;

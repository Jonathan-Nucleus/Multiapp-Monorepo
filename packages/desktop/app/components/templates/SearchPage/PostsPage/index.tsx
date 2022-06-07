import { FC } from "react";
import { GlobalSearchData } from "shared/graphql/query/search/useGlobalSearch";
import PostsList from "../../../modules/posts/PostsList";

interface PostsPageProps {
  posts: GlobalSearchData["globalSearch"]["posts"] | undefined;
}

const PostsPage: FC<PostsPageProps> = ({ posts }) => {
  return (
    <div>
      <PostsList posts={posts} displayFilter={false} />
    </div>
  );
};

export default PostsPage;

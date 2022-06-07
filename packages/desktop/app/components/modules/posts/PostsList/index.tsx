import { FC } from "react";
import Post from "../Post";
import { PostSummary } from "shared/graphql/fragments/post";
import { PostCategory, PostRoleFilter } from "backend/graphql/posts.graphql";
import Skeleton from "./Skeleton";
import FilterHeader from "./FilterHeader";

interface PostsListProps {
  posts: PostSummary[] | undefined;
  displayFilter?: boolean;
  onSelectPost: (post: PostSummary) => void;
  onRefresh?: (
    categories: PostCategory[] | undefined,
    filter?: PostRoleFilter
  ) => void;
}

const PostsList: FC<PostsListProps> = ({
  posts,
  displayFilter = true,
  onSelectPost,
  onRefresh,
}) => {
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
          <div key={index} className="mt-4 mb-4">
            <Post post={post} onClickToEdit={() => onSelectPost(post)} />
          </div>
        ))}
      </div>
    </>
  );
};

export default PostsList;

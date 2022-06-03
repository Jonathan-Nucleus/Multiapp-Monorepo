import { FC } from "react";
import Post from "../Post";
import { PostSummary } from "shared/graphql/fragments/post";
import { PostCategory } from "backend/graphql/posts.graphql";
import Skeleton from "./Skeleton";
import FilterHeader from "./FilterHeader";

interface PostsListProps {
  posts: PostSummary[] | undefined;
  displayFilter?: boolean;
  onSelectPost: (post: PostSummary) => void;
  onRefresh?: (categories: PostCategory[] | undefined) => void;
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
  if (posts.length == 0) {
    return <></>;
  }
  return (
    <>
      {displayFilter && (
        <FilterHeader
          onFilterChange={(categories, from) => {
            onRefresh?.(categories.length > 0 ? categories : undefined);
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

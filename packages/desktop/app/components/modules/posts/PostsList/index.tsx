import { FC, useState } from "react";
import FilterDropdown, { FilterCategory } from "./FilterDropdown";
import Post from "../Post";
import { PostSummary } from "shared/graphql/fragments/post";
import { PostCategory } from "backend/graphql/posts.graphql";
import Skeleton from "./Skeleton";

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
  const [selectedTopics, setSelectedTopics] = useState<FilterCategory[]>([
    "ALL",
  ]);
  const [selectedFrom, setSelectedFrom] = useState("Everyone");
  if (!posts) {
    return <Skeleton />;
  }
  if (posts.length == 0) {
    return <></>;
  }
  return (
    <>
      {displayFilter &&
        <FilterDropdown
          initialTopics={selectedTopics}
          from={selectedFrom}
          onSelect={(topics, from) => {
            if (topics.length == 0) {
              topics.push("ALL");
            }
            setSelectedTopics(topics);
            setSelectedFrom(from);
            const postCategories = topics.includes("ALL")
              ? undefined
              : (topics as PostCategory[]);
            onRefresh && onRefresh(postCategories);
          }}
        />
      }
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

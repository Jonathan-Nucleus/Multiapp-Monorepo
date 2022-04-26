import { FC, useState } from "react";
import FilterDropdown, { FilterCategory } from "./FilterDropdown";
import Post from "desktop/app/components/common/Post";
import { PostSummary } from "mobile/src/graphql/fragments/post";

export interface PostsListProps {
  posts: PostSummary[];
  onFilter?: (topics: FilterCategory[], audience: string) => void;
}

const PostsList: FC<PostsListProps> = ({ posts, onFilter }) => {
  const [selectedTopics, setSelectedTopics] = useState<FilterCategory[]>([
    "ALL",
  ]);
  const [selectedFrom, setSelectedFrom] = useState("Everyone");
  const updateFilter = (topics: FilterCategory[], audience: string): void => {
    if (topics.length == 0) {
      topics.push("ALL");
    }
    setSelectedTopics(topics);
    setSelectedFrom(audience);
    onFilter?.(topics, audience);
  };

  return (
    <>
      <FilterDropdown
        initialTopics={selectedTopics}
        from={selectedFrom}
        onSelect={updateFilter}
      />
      <div>
        {posts.map((post, index) => (
          <div key={index} className="mt-4 mb-4">
            <Post post={post} />
          </div>
        ))}
      </div>
    </>
  );
};

export default PostsList;

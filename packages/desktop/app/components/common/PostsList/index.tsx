import { FC, useState } from "react";
import { PostCategory } from "backend/graphql/posts.graphql";
import FilterDropdown, { FilterCategory } from "./FilterDropdown";
import Post from "desktop/app/components/common/Post";

import { useFetchPosts } from "desktop/app/graphql/queries";

export interface PostsListProps {
  posts: Post[];
  onFilter?: (topics: FilterCategory[], audience: string) => void;
}

const PostsList: FC<PostsListProps> = ({ posts, onFilter }) => {
  const [selectedTopics, setSelectedTopics] = useState<FilterCategory[]>([
    "ALL",
  ]);
  const [selectedFrom, setSelectedFrom] = useState("Everyone");
  const { data, refetch } = useFetchPosts();

  const updateFilter = (topics: FilterCategory[], audience: string): void => {
    if (topics.length == 0) {
      topics.push("ALL");
    }

    setSelectedTopics(topics);
    setSelectedFrom(audience);

    const postCategories = (
      topics.includes("ALL") ? [] : topics
    ) as PostCategory[];

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

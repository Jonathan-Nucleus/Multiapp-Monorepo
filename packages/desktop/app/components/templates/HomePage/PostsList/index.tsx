import { FC, useState } from "react";
import { PostCategory } from "backend/graphql/posts.graphql";
import FilterDropdown, { FilterCategory } from "./FilterDropdown";
import Post from "../../../common/Post";

import { useFetchPosts } from "desktop/app/graphql/queries";

const PostsList: FC = () => {
  const [selectedTopics, setSelectedTopics] = useState<FilterCategory[]>([
    "ALL",
  ]);
  const [selectedFrom, setSelectedFrom] = useState("Everyone");
  const { data, refetch } = useFetchPosts();

  const posts = data?.posts ?? [];
  return (
    <>
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
          refetch({
            categories: postCategories,
          });
        }}
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

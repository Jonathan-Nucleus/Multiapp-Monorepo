import { FC, useState } from "react";
import { CaretDown, SlidersHorizontal, X } from "phosphor-react";

import Post from "../Post";
import { FetchPostsData } from "desktop/app/graphql/queries";

type Post = Exclude<FetchPostsData["posts"], undefined>[number];
interface PostsProps {
  posts: Post[];
}

const PostsList: FC<PostsProps> = ({ posts }) => {
  return (
    <>
      <div className="flex items-center  my-3 ml-4 md:m-0">
        <SlidersHorizontal color="white" size={24} />
        <div className="text-white">All topics</div>
      </div>
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

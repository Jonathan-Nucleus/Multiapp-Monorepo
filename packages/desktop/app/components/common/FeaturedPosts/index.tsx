import { FC } from "react";
import "@splidejs/react-splide/css";
import { Splide, SplideSlide } from "@splidejs/react-splide";

import PostCard from "../Post";
import Card from "../Card";
import { FetchPostsData } from "desktop/app/graphql/queries";

type Post = Exclude<FetchPostsData["posts"], undefined>[number];
interface PostsProps {
  posts: Post[];
}

const FeaturedPosts: FC<PostsProps> = ({ posts }) => {
  return (
    <>
      <div className="text-white mb-2 mt-8 ml-4">Featured Posts</div>
      <div className="hidden md:block">
        {posts.map((post, index) => (
          <div key={index} className="mt-2 mb-8">
            <PostCard post={post} />
          </div>
        ))}
      </div>
      <div className="w-full block lg:hidden">
        <Card className="border-0 mt-5 bg-transparent p-0 shadow-none rounded-none">
          <Splide
            options={{
              autoWidth: true,
              rewind: true,
              lazyLoad: "nearby",
              cover: true,
              pagination: false,
            }}
          >
            {posts.map((post, index) => (
              <SplideSlide key={index}>
                <div className="mx-2">
                  <PostCard post={post} />
                </div>
              </SplideSlide>
            ))}
          </Splide>
        </Card>
      </div>
    </>
  );
};

export default FeaturedPosts;

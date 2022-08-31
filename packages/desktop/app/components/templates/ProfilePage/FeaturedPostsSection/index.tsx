import { FC } from "react";
import PostsList from "../../../modules/posts/PostsList";
import { useFeaturedPosts } from "shared/graphql/query/user/useFeaturedPosts";

interface PostsSectionProps {
  userId: string;
}

const FeaturedPostsSection: FC<PostsSectionProps> = ({ userId }) => {
  const { data: featuredPostsData } = useFeaturedPosts(userId);
  const featuredPosts = featuredPostsData?.userProfile?.posts ?? [];

  return (
    <>
      {featuredPosts && featuredPosts.length === 0 ? (
        <>
          <div className="text-bold text-white opacity-60 py-4">
            You don’t have any featured posts, yet.
          </div>
        </>
      ) : (
        <PostsList
          isFeaturedList={true}
          displayFilter={false}
          posts={featuredPosts}
        />
      )}
    </>
  );
};

export default FeaturedPostsSection;

import { FC, useState } from "react";
import { Plus } from "phosphor-react";
import CompanyCard from "./CompanyCard";
import FeaturedProfessionals from "./FeaturedProfessionals";
import AddPost from "./AddPost";
import InviteFriends from "../../modules/users/InviteFriends";
import Button from "../../common/Button";
import { useAccount, useFetchPosts } from "mobile/src/graphql/query/account";
import ProfileCardSmall from "../../modules/users/ProfileCardSmall";
import EditPostModal from "../../modules/posts/EditPostModal";
import { PostSummary } from "mobile/src/graphql/fragments/post";
import Watchlist from "./Watchlist";
import PostsList from "../../modules/posts/PostsList";

const HomePage: FC = () => {
  const [showPostModal, setShowPostModal] = useState(false);
  const { data: { account } = {} } = useAccount();
  const { data: { posts } = {}, refetch } = useFetchPosts();
  const [selectedPost, setSelectedPost] = useState<PostSummary | undefined>(
    undefined,
  );

  return (
    <>
      <div className="flex flex-row mt-5 lg:mt-20 px-2">
        <div className="w-80 hidden lg:block flex-shrink-0 mx-4">
          <ProfileCardSmall user={account} />
          <div className="mt-12">
            <CompanyCard user={account} />
          </div>
        </div>
        <div className="min-w-0 flex-grow">
          <div className="px-4">
            <FeaturedProfessionals />
            <div className="hidden md:block">
              <AddPost
                user={account}
                onClick={() => {
                  setSelectedPost(undefined);
                  setShowPostModal(true);
                }}
              />
            </div>
            <div className="mt-8">
              <PostsList
                posts={posts}
                onSelectPost={(post) => {
                  setSelectedPost(post);
                  setShowPostModal(true);
                }}
                onRefresh={(categories) => refetch({ categories })}
              />
            </div>
          </div>
        </div>
        <div className="w-80 hidden lg:block flex-shrink-0 mx-4">
          <InviteFriends />
          <div className="mt-5">
            <Watchlist user={account} />
          </div>
        </div>
        <div className="block md:hidden absolute bottom-5 right-5">
          <Button
            variant="gradient-primary"
            className="w-12 h-12 rounded-full"
            onClick={() => setShowPostModal(true)}
          >
            <Plus color="white" size={24} />
          </Button>
        </div>
      </div>
      {showPostModal && (
        <EditPostModal
          post={selectedPost}
          show={showPostModal}
          onClose={() => setShowPostModal(false)}
        />
      )}
    </>
  );
};

export default HomePage;

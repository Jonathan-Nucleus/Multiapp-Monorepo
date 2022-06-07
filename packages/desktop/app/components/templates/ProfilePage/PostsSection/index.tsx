import { FC, useState } from "react";
import { usePosts } from "shared/graphql/query/user/usePosts";
import PostsList from "../../../modules/posts/PostsList";
import EditPostModal, {
  PostActionType,
} from "../../../modules/posts/EditPostModal";
import Image from "next/image";
import NoPostSvg from "shared/assets/images/no-post.svg";
import Button from "../../../common/Button";
import { Plus } from "phosphor-react";

interface PostsSectionProps {
  userId: string;
  showAddPost: boolean;
}

const PostsSection: FC<PostsSectionProps> = ({ userId, showAddPost }) => {
  const { data: { userProfile } = {}, refetch } = usePosts(userId);
  const [postAction, setPostAction] = useState<PostActionType>();
  return (
    <>
      <PostsList
        posts={userProfile?.posts}
        onRefresh={(categories) => refetch({ categories })}
      />
      {userProfile?.posts && userProfile.posts.length == 0 && showAddPost && (
        <>
          <div className="text-center pt-4">
            <Image src={NoPostSvg} alt="" />
            <div className="text-white text-xl my-4">
              You don’t have any posts, yet.
            </div>
            <Button
              variant="gradient-primary"
              className="w-52 h-12 rounded-full"
              onClick={() => setPostAction({ type: "create" })}
            >
              <Plus color="white" size={24} />
              <div className="text text-white">Create a Post</div>
            </Button>
          </div>
        </>
      )}
      {postAction && (
        <EditPostModal
          actionData={postAction}
          show={!!postAction}
          onClose={() => setPostAction(undefined)}
        />
      )}
    </>
  );
};

export default PostsSection;

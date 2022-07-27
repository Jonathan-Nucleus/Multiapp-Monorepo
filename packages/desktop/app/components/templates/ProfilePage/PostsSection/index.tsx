import { FC, useState } from "react";
import { Plus } from "phosphor-react";

import Button from "../../../common/Button";
import EditPostModal, {
  PostActionType,
} from "../../../modules/posts/EditPostModal";
import Image from "next/image";
import NoPostSvg from "shared/assets/images/no-post.svg";
import PostsList, { PostCategory } from "../../../modules/posts/PostsList";

import { usePosts } from "shared/graphql/query/user/usePosts";

interface PostsSectionProps {
  userId: string;
  showAddPost: boolean;
}

const PostsSection: FC<PostsSectionProps> = ({ userId, showAddPost }) => {
  const [categories, setCategories] = useState<PostCategory[]>();
  const { data: { userProfile } = {} } = usePosts(userId, categories);
  const [postAction, setPostAction] = useState<PostActionType>();

  return (
    <>
      <PostsList
        posts={userProfile?.posts}
        initialFilter={{ categories, roleFilter: "EVERYONE" }}
        onFilterChange={({ categories: _categories }) =>
          setCategories(_categories)
        }
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

import { FC, useState } from "react";
import Card from "../../../common/Card";
import { ChatCenteredText, Share, ThumbsUp } from "phosphor-react";
import { useLikePost } from "shared/graphql/mutation/posts/useLikePost";
import LikesModal from "./LikesModal";
import { PostSummary } from "shared/graphql/fragments/post";
import { useAccount } from "shared/graphql/query/account/useAccount";
import ActionMenu from "./ActionMenu";
import Header from "./Header";
import PostBody from "./PostBody";
import CommentsList from "./CommentsList";
import Button from "../../../common/Button";

interface PostProps {
  post: PostSummary;
  onClickToEdit?: () => void;
}

const Post: FC<PostProps> = ({ post, onClickToEdit }) => {
  const { data: { account } = {} } = useAccount({ fetchPolicy: "cache-only" });
  const { isLiked, toggleLike } = useLikePost(post._id);
  const [visiblePostLikeModal, setVisiblePostLikeModal] = useState(false);
  const [visibleComment, setVisibleComment] = useState(false);
  const isMyPost =
    (post.user && post.user._id == account?._id) ||
    (post.company && account?.companyIds?.includes(post.company._id));
  const isMuted = account?.mutedPostIds?.includes(post._id) ?? false;
  return (
    <>
      <Card className="border-0 p-0 rounded-none overflow-visible	md:rounded-2xl mb-6">
        <div className="flex px-4 pt-4">
          <div>
            <Header post={post} accountId={account?._id} />
          </div>
          <div className="ml-auto">
            <ActionMenu
              post={post}
              isMyPost={isMyPost ?? false}
              isMuted={isMuted}
              onClickToEdit={onClickToEdit}
            />
          </div>
        </div>
        <div className="mt-4 mb-4">
          <PostBody account={account} post={post} />
        </div>
        <div className="flex items-center border-t border-brand-overlay/[.1] px-4 py-3">
          <div className="text-white/60">
            <div
              className="flex w-10 items-center cursor-pointer text-primary-medium"
              onClick={toggleLike}
            >
              <ThumbsUp
                weight={isLiked ? "fill" : "light"}
                color={isLiked ? "currentColor" : "white"}
                size={24}
              />
              {post.likeIds && post.likeIds.length > 0 && (
                <div className="text-white text-xs ml-2 opacity-60">
                  {post.likeIds.length}
                </div>
              )}
            </div>
          </div>
          <div className="w-10 flex items-center text-white/60 ml-10">
            <Button
              variant="text"
              className="select-none font-normal tracking-normal py-0"
              onClick={() => setVisibleComment(!visibleComment)}
            >
              <ChatCenteredText weight="light" color="currentColor" size={24} />
              {post.commentIds && (
                <div className="text-white ml-2 text-xs opacity-60">
                  {post.commentIds.length}
                </div>
              )}
            </Button>
          </div>
          <div className="w-10 text-white/60 ml-10">
            <div className="flex items-center cursor-pointer">
              <Share weight="light" color="currentColor" size={24} />
              {post.shareIds && post.shareIds.length > 0 && (
                <div className="text-white ml-2 text-xs opacity-60">
                  {post.shareIds.length}
                </div>
              )}
            </div>
          </div>
          <div className="ml-auto flex items-center opacity-60">
            {post.likeIds && post.likeIds.length > 0 && (
              <div
                className="text-white cursor-pointer text-xs"
                onClick={() => setVisiblePostLikeModal(true)}
              >
                {post.likeIds.length}{" "}
                {post.likeIds.length === 1 ? "Like" : "Likes"}
              </div>
            )}
          </div>
        </div>
        {visibleComment && (
          <CommentsList show={visibleComment} postId={post._id} />
        )}
      </Card>
      <LikesModal
        show={visiblePostLikeModal}
        onClose={() => setVisiblePostLikeModal(false)}
        members={post.likes}
      />
    </>
  );
};

export default Post;

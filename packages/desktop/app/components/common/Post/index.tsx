import { FC, useState } from "react";
import Card from "../Card";
import Image from "next/image";
import {
  ChatCenteredText,
  DotsThreeOutlineVertical,
  Share,
  ShieldCheck,
  ThumbsUp,
} from "phosphor-react";
import { useSession } from "next-auth/react";
import Button from "../Button";
import Avatar from "../Avatar";
import LikeModal from "./LikeModal";
import { useLikePost } from "mobile/src/graphql/mutation/posts";
import CommentPost from "../Comment";
import moment from "moment";
import { PostType } from "desktop/app/types/common-props";

interface PostProps {
  post: PostType;
}

const Post: FC<PostProps> = ({ post }: PostProps) => {
  const { data: session } = useSession();
  const [likePost] = useLikePost();

  const { user } = post;
  const [liked, setLiked] = useState(
    (session?.user && post.likeIds?.includes(session.user._id)) ?? false,
  );
  const [visiblePostLikeModal, setVisiblePostLikeModal] = useState(false);
  const [visibleComment, setVisibleComment] = useState(false);
  const toggleLike = async (): Promise<void> => {
    const toggled = !liked;
    const { data } = await likePost({
      variables: { like: toggled, postId: post._id },
    });

    data && data.likePost
      ? setLiked(toggled)
      : console.log("Error liking post");
  };

  return (
    <>
      <Card className="border-0 p-0 rounded-none	md:rounded-2xl">
        <div className="flex items-center px-4 pt-4">
          <div className="w-14 h-14 flex items-center justify-center">
            {user && user.avatar && <Avatar size={56} src={user.avatar} />}
          </div>
          <div className="ml-2">
            <div className="flex items-center">
              <div className="text-white mr-1">{`${user.firstName} ${user.lastName}`}</div>
              {(user.role === "VERIFIED" || user.role === "PROFESSIONAL") && (
                <ShieldCheck
                  className="text-success"
                  color="currentColor"
                  weight="fill"
                  size={16}
                />
              )}
              {user.role === "PROFESSIONAL" && (
                <>
                  <div className="text-white mx-0.5 text-tiny">{user.role}</div>
                  <span className="mx-1 text-white/[0.6]">•</span>
                </>
              )}
              <Button
                variant="text"
                className="text-tiny text-primary tracking-wider font-medium py-0 pl-0.5"
              >
                FOLLOW
              </Button>
            </div>
            <div className="text-xs text-white opacity-60">{user.position}</div>
            <div className="text-xs text-white opacity-60">
              {moment(post.createdAt).format("MMM DD")}
            </div>
          </div>
        </div>
        <div className="text-sm text-white opacity-90 px-4 mt-4">
          {post.body}
        </div>
        <div className="flex flex-wrap -mx-1 mt-4 px-4">
          {post.categories.map((category) => (
            <div
              key={category}
              className={`bg-white/[.25] uppercase rounded-full text-xs text-white
              font-medium mx-1 px-4 py-1`}
            >
              {category}
            </div>
          ))}
        </div>
        {!!post.mediaUrl && (
          <div className="relative h-auto mt-5 border-b border-white/[.12]">
            <Image
              loader={() =>
                `${process.env.NEXT_PUBLIC_POST_URL}/${post.mediaUrl}`
              }
              src={`${process.env.NEXT_PUBLIC_POST_URL}/${post.mediaUrl}`}
              alt=""
              layout="responsive"
              unoptimized={true}
              objectFit="cover"
              width={300}
              height={200}
            />
          </div>
        )}

        <div className="flex items-center p-4">
          <div className="opacity-60 text-white">
            <div
              className="flex w-10 items-center cursor-pointer text-primary-medium"
              onClick={toggleLike}
            >
              <ThumbsUp
                weight={liked ? "fill" : "light"}
                color={liked ? "currentColor" : "white"}
                size={24}
              />
              {post.likeIds && post.likeIds.length > 0 && (
                <div className="text-white text-xs ml-2">
                  {post.likeIds.length}
                </div>
              )}
            </div>
          </div>
          <div className="w-10 opacity-60 text-white ml-10">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setVisibleComment(!visibleComment)}
            >
              <ChatCenteredText weight="light" color="currentColor" size={24} />
              {post.commentIds && (
                <div className="text-white ml-2 text-xs">
                  {post.commentIds.length}
                </div>
              )}
            </div>
          </div>
          <div className="w-10 opacity-60 text-white ml-10">
            <div className="flex items-center cursor-pointer">
              <Share weight="light" color="currentColor" size={24} />
              {post.shareIds && post.shareIds.length > 0 && (
                <div className="text-white ml-2 text-xs">
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
            <div className="ml-3">
              <DotsThreeOutlineVertical
                color="white"
                weight="light"
                size={24}
              />
            </div>
          </div>
        </div>
        {visibleComment && <CommentPost post={post} />}
      </Card>

      <LikeModal
        show={visiblePostLikeModal}
        onClose={() => setVisiblePostLikeModal(false)}
        members={post.likes}
      />
    </>
  );
};

export default Post;

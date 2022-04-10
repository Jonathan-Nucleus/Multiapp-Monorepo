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
import Button from "../Button";
import { useSession } from "next-auth/react";

import { FetchPostsData } from "desktop/app/graphql/queries";
import { useLikePost } from "desktop/app/graphql/mutations/posts";

type Post = Exclude<FetchPostsData["posts"], undefined>[number];
interface PostProps {
  post: Post;
}

const Post: FC<PostProps> = ({ post }: PostProps) => {
  const { data: session } = useSession();
  const { user } = post;
  const [liked, setLiked] = useState(
    (session?.user && post.likeIds?.includes(session.user._id)) ?? false
  );
  const [likePost] = useLikePost();
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
    <Card className="border-0 p-0">
      <div className="flex items-center px-4 pt-4">
        <div className="w-14 h-14 flex items-center justify-center">
          {user && user.avatar && (
            <Image
              loader={() =>
                `${process.env.NEXT_PUBLIC_AVATAR_URL}/${user.avatar}`
              }
              src={`${process.env.NEXT_PUBLIC_AVATAR_URL}/${user.avatar}`}
              alt=""
              width={56}
              height={56}
              className="object-cover rounded-full"
              unoptimized={true}
            />
          )}
        </div>
        <div className="ml-2">
          <div className="flex items-center">
            <div className="text-white">{`${user.firstName} ${user.lastName}`}</div>
            <ShieldCheck
              className="text-success ml-2"
              color="currentColor"
              weight="fill"
              size={16}
            />
            {user.role === "PROFESSIONAL" && (
              <div className="text-white mx-1">{user.role} •</div>
            )}
            <Button
              variant="text"
              className="text-xs text-primary tracking-normal font-normal py-0"
            >
              FOLLOW
            </Button>
          </div>
          <div className="text-xs text-white opacity-60">{user.position}</div>
          <div className="text-xs text-white opacity-60">{post.createdAt}</div>
        </div>
      </div>
      <div className="text-sm text-white opacity-90 px-4 mt-4">{post.body}</div>
      <div className="flex flex-wrap -mx-1 mt-4 px-4">
        {post.categories.map((category, index) => (
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
            className="flex items-center cursor-pointer"
            onClick={toggleLike}
          >
            <ThumbsUp
              weight={liked ? "fill" : "light"}
              color="currentColor"
              size={24}
            />
            {post.likeIds && post.likeIds.length > 0 && (
              <div className="text-white opacity-60 ml-2">
                {post.likeIds.length}
              </div>
            )}
          </div>
        </div>
        <div className="opacity-60 text-white ml-10">
          <div className="flex items-center cursor-pointer">
            <ChatCenteredText weight="light" color="currentColor" size={24} />
            {post.commentIds && (
              <div className="text-white ml-2">{post.commentIds.length}</div>
            )}
          </div>
        </div>
        <div className="opacity-60 text-white ml-10">
          <div className="flex items-center cursor-pointer">
            <Share weight="light" color="currentColor" size={24} />
            {/*<div className="text-white ml-2">{post.shares}</div>*/}
          </div>
        </div>
        <div className="ml-auto flex items-center opacity-60">
          {post.likeIds && post.likeIds.length > 0 && (
            <div className="text-white">{post.likeIds.length} Likes</div>
          )}

          <div className="ml-3">
            <DotsThreeOutlineVertical color="white" weight="light" size={24} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Post;

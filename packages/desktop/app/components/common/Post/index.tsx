import { FC } from "react";
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

interface PostProps {
  post: {
    user: {
      image: string;
      name: string;
      type: string;
      position: string;
    };
    description: string;
    topics: string[];
    image: string;
    postedAt: string;
    following: boolean;
    followers: number;
    messages: number;
    shares: number;
    likes: number;
  };
}

const Post: FC<PostProps> = ({ post }: PostProps) => {
  return (
    <Card className="border-0 p-0">
      <div className="flex items-center px-4 pt-4">
        <div className="w-14 h-14 flex items-center justify-center">
          <Image
            loader={() => post.user.image}
            src={post.user.image}
            alt=""
            width={56}
            height={56}
            className="object-cover rounded-full"
            unoptimized={true}
          />
        </div>
        <div className="ml-2">
          <div className="flex items-center">
            <div className="text-white">{post.user.name}</div>
            <ShieldCheck
              className="text-success ml-2"
              color="currentColor"
              weight="fill"
              size={16}
            />
            <div className="text-white mx-1">{post.user.type} •</div>
            <Button
              variant="text"
              className="text-xs text-primary tracking-normal font-normal py-0"
            >
              FOLLOW
            </Button>
          </div>
          <div className="text-xs text-white opacity-60">
            {post.user.position}
          </div>
          <div className="text-xs text-white opacity-60">{post.postedAt}</div>
        </div>
      </div>
      <div className="text-sm text-white opacity-90 px-4 mt-4">
        {post.description}
      </div>
      <div className="flex flex-wrap -mx-1 mt-4 px-4">
        {post.topics.map((topic, index) => (
          <div
            key={index}
            className="bg-white/[.25] uppercase rounded-full text-xs text-white font-medium mx-1 px-4 py-1"
          >
            {topic}
          </div>
        ))}
      </div>
      <div className="relative h-80 mt-5 border-b border-white/[.12]">
        <Image
          loader={() => post.image}
          src={post.image}
          alt=""
          layout="fill"
          unoptimized={true}
          objectFit="cover"
        />
      </div>
      <div className="flex items-center p-4">
        <div className="opacity-60 text-white">
          <div className="flex items-center cursor-pointer">
            <ThumbsUp
              weight={post.following ? "fill" : "light"}
              color="currentColor"
              size={24}
            />
            <div className="text-white opacity-60 ml-2">{post.followers}</div>
          </div>
        </div>
        <div className="opacity-60 text-white ml-10">
          <div className="flex items-center cursor-pointer">
            <ChatCenteredText weight="light" color="currentColor" size={24} />
            <div className="text-white ml-2">{post.followers}</div>
          </div>
        </div>
        <div className="opacity-60 text-white ml-10">
          <div className="flex items-center cursor-pointer">
            <Share weight="light" color="currentColor" size={24} />
            <div className="text-white ml-2">{post.shares}</div>
          </div>
        </div>
        <div className="ml-auto flex items-center opacity-60">
          <div className="text-white">{post.likes} Likes</div>
          <div className="ml-3">
            <DotsThreeOutlineVertical color="white" weight="light" size={24} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Post;

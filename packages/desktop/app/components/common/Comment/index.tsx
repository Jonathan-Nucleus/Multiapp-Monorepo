import { FC, useState } from "react";
import Card from "../Card";
import Image from "next/image";
import { PaperPlaneRight, Image as PhotoImage, Smiley } from "phosphor-react";
import { useSession } from "next-auth/react";
import moment from "moment";

import Button from "../Button";
import Avatar from "../Avatar";
import Input from "../Input";
import CommentDetail from "./Details";

import { FetchPostsData, useAccount } from "desktop/app/graphql/queries";
import { useFetchPosts } from "desktop/app/graphql/queries";
import { useCommentPost } from "desktop/app/graphql/mutations/posts";

type Post = Exclude<FetchPostsData["posts"], undefined>[number];

interface CommentPostProps {
  post: Post;
}

const CommentPost: FC<CommentPostProps> = ({ post }: CommentPostProps) => {
  const { data: accountData } = useAccount();
  const [commentPost] = useCommentPost();
  const [comment, setComment] = useState("");

  const sendMessage = async (): Promise<void> => {
    if (!comment || comment === "") return;

    try {
      const { data } = await commentPost({
        variables: {
          comment: {
            body: comment,
            postId: post._id,
            mentionIds: [], // Update to add mentions
          },
        },
        refetchQueries: ["Posts"],
      });

      if (data?.comment) {
        setComment("");
      }
    } catch (err) {
      console.log("send mesage error", err);
    }
  };

  return (
    <Card className="border-0 p-0 px-4 rounded-none">
      <div className="flex items-center">
        <Avatar src={accountData?.account?.avatar} size={36} />
        <div className="flex items-center justify-between p-4 flex-1 relative">
          <Input
            placeholder="Add a comment..."
            className="rounded-full bg-background-DEFAULT"
            value={comment}
            onChange={(event) => {
              setComment(event.currentTarget.value);
            }}
          />
          <Button variant="text" className="absolute right-12">
            <Smiley size={20} color="#00AAE0" weight="fill" />
          </Button>
          <Button variant="text" className="absolute right-6">
            <PhotoImage size={20} color="#00AAE0" weight="fill" />
          </Button>
        </div>
        <Button variant="text" className="flex-shrink-0" onClick={sendMessage}>
          <PaperPlaneRight size={32} />
        </Button>
      </div>
      {post.comments.map((comment) => (
        <div key={comment._id}>
          <div className="flex">
            <Avatar src={comment.user.avatar} size={36} />
            <div className="ml-2 w-full">
              <CommentDetail comment={comment} />
            </div>
          </div>
        </div>
      ))}
    </Card>
  );
};

export default CommentPost;

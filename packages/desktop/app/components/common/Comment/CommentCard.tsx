import { FC, useState } from "react";
import { DotsThreeOutlineVertical, Trash, Pen } from "phosphor-react";
import moment from "moment";
import { Menu } from "@headlessui/react";

import SendMessage from "./SendMessage";
import Button from "../Button";
import type { Comment } from "backend/graphql/comments.graphql";
import {
  useLikePost,
  useDeleteComment,
  useEditCommentPost,
  useCommentPost,
} from "desktop/app/graphql/mutations/posts";
import { useAccount } from "desktop/app/graphql/queries";
import Avatar from "../Avatar";

interface CommentCardProps {
  comment: Comment;
  postId: string;
  size?: number;
  children: any;
}

const CommentCard: FC<CommentCardProps> = ({
  comment,
  postId,
  size,
  children,
}: CommentCardProps) => {
  const { data: accountData } = useAccount();
  const [likePost] = useLikePost();
  const [deleteComment] = useDeleteComment();
  const [editComment] = useEditCommentPost();
  const [commentPost] = useCommentPost();
  const account = accountData?.account;

  const [isEditable, setIsEditable] = useState(false);
  const [liked, setLiked] = useState(
    (account && comment.likeIds?.includes(account._id)) ?? false
  );
  const [visibleReply, setVisibleReply] = useState(false);

  const toggleLike = async (): Promise<void> => {
    // TODO Like Comment
    const toggled = !liked;
    const { data } = await likePost({
      variables: { like: toggled, postId: comment._id },
    });

    data && data.likePost
      ? setLiked(toggled)
      : console.log("Error liking post");
  };

  const handleDeleteComment = async (): Promise<void> => {
    try {
      const { data } = await deleteComment({
        variables: { commentId: comment._id },
        refetchQueries: ["Posts"],
      });
    } catch (err) {
      console.log("delete comment", err);
    }
  };

  const handleEditComment = async (
    message: string,
    mediaUrl?: string
  ): Promise<void> => {
    if (!message || message.trim() === "") return;

    try {
      const { data } = await editComment({
        variables: {
          comment: {
            _id: comment._id,
            body: message,
            mentionIds: [], // Implement mentions
          },
        },
        refetchQueries: ["Posts"],
      });

      if (data?.editComment) {
        setIsEditable(false);
      }
    } catch (err) {
      console.log("send mesage error", err);
    }
  };

  const handleReplyComment = async (
    reply: string,
    mediaUrl?: string
  ): Promise<void> => {
    if (!reply || reply.trim() === "") return;
    try {
      await commentPost({
        variables: {
          comment: {
            body: reply,
            postId: postId,
            commentId: comment._id,
            mentionIds: [], // Update to add mentions
          },
        },
        refetchQueries: ["Posts"],
      });
    } catch (err) {
      console.log("send mesage error", err);
    }
  };
  return (
    <>
      <div className="flex">
        <Avatar src={comment.user.avatar} size={size ? size : 36} />
        <div className="ml-2 w-full">
          <div className="p-2 rounded-lg bg-background-popover">
            <div className="flex justify-between">
              <div>
                <div className="text text-xs text-white opacity-60">
                  {comment.user.firstName} {comment.user.lastName}
                </div>
                <div className="text text-xs text-white opacity-60">
                  {comment.user.role} @ {comment.user.position} •{" "}
                  {moment(comment.createdAt).fromNow()}
                </div>
              </div>
              {account?._id === comment.user._id && (
                <div className="flex items-center">
                  <Menu as="div" className="relative">
                    <Menu.Button>
                      <DotsThreeOutlineVertical
                        size={18}
                        className="opacity-60"
                      />
                    </Menu.Button>
                    <Menu.Items
                      className={`z-10	absolute right-0 w-32 bg-surface-light10 shadow-md shadow-black rounded`}
                    >
                      <Menu.Item>
                        <div className="divide-y border-white/[.12] divide-inherit pb-2">
                          <div className="flex items-center p-2">
                            <Button
                              variant="text"
                              className="py-0"
                              onClick={handleDeleteComment}
                            >
                              <Trash size={18} />
                              <span className="ml-4">Delete</span>
                            </Button>
                          </div>
                          <div className="flex items-center p-2">
                            <Button
                              variant="text"
                              className="py-0"
                              onClick={() => setIsEditable(true)}
                            >
                              <Pen size={18} color="#00AAE0" />
                              <span className="ml-4">Edit</span>
                            </Button>
                          </div>
                        </div>
                      </Menu.Item>
                    </Menu.Items>
                  </Menu>
                </div>
              )}
            </div>
            {isEditable ? (
              <SendMessage
                size={24}
                onSend={(val, mediaUrl) => handleEditComment(val, mediaUrl)}
                placeholder="Edit comment..."
                message={comment.body}
              />
            ) : (
              <div className="text text-xs text-white mt-4">{comment.body}</div>
            )}
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <Button variant="text" onClick={toggleLike}>
                <div className="text text-xs text-white">Like</div>
              </Button>
              <Button
                variant="text"
                className="ml-4"
                onClick={() => setVisibleReply(true)}
              >
                <div className="text text-xs text-white">Reply</div>
              </Button>
            </div>
            <div className="text text-xs text-white opacity-60">
              {comment.likeIds?.length ?? 0}{" "}
              {comment.likeIds?.length === 1 ? "Like" : "Likes"}
            </div>
          </div>
          <div className="child-list">{children}</div>
        </div>
      </div>
      {visibleReply && (
        <SendMessage
          size={24}
          onSend={(val, mediaUrl) => handleReplyComment(val, mediaUrl)}
          placeholder="Reply comment..."
        />
      )}
    </>
  );
};

export default CommentCard;
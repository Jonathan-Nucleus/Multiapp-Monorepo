import { FC, useState } from "react";
import Image from "next/image";
import {
  DotsThreeOutlineVertical,
  Trash,
  Pen,
  Smiley,
  PaperPlaneRight,
  Image as PhotoImage,
} from "phosphor-react";
import moment from "moment";
import { Menu } from "@headlessui/react";

import Button from "../Button";
import Input from "../Input";

import type { Comment } from "backend/graphql/comments.graphql";
import {
  useLikePost,
  useDeleteComment,
  useEditCommentPost,
} from "desktop/app/graphql/mutations/posts";
import { useAccount } from "desktop/app/graphql/queries";

interface CommentDetailProps {
  comment: Comment;
}

const CommentDetail: FC<CommentDetailProps> = ({
  comment,
}: CommentDetailProps) => {
  const { data: accountData } = useAccount();
  const [likePost] = useLikePost();
  const [deleteComment] = useDeleteComment();
  const [editComment] = useEditCommentPost();

  const account = accountData?.account;

  const [isEditable, setIsEditable] = useState(false);
  const [postComment, setPostComment] = useState(comment.body);
  const [liked, setLiked] = useState(
    (account && comment.likeIds?.includes(account._id)) ?? false
  );

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

  const handleEditComment = async (): Promise<void> => {
    if (!postComment || postComment === "") return;

    try {
      const { data } = await editComment({
        variables: {
          comment: {
            _id: comment._id,
            body: postComment,
            mentionIds: [], // Implement mentions
          },
        },
        refetchQueries: ["Posts"],
      });

      if (data?.editComment) {
        setPostComment("");
        setIsEditable(false);
      }
    } catch (err) {
      console.log("send mesage error", err);
    }
  };

  return (
    <>
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
                  <DotsThreeOutlineVertical size={18} className="opacity-60" />
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
          <div className="flex items-center">
            <div className="flex items-center justify-between p-4 flex-1 relative">
              <Input
                placeholder="Edit comment..."
                className="rounded-full bg-background-DEFAULT"
                value={postComment}
                onChange={(event) => {
                  setPostComment(event.currentTarget.value);
                }}
              />
              <Button variant="text" className="absolute right-12">
                <Smiley size={20} color="#00AAE0" weight="fill" />
              </Button>
              <Button variant="text" className="absolute right-6">
                <PhotoImage size={20} color="#00AAE0" weight="fill" />
              </Button>
            </div>
            <Button
              variant="text"
              className="flex-shrink-0"
              onClick={handleEditComment}
            >
              <PaperPlaneRight size={32} />
            </Button>
          </div>
        ) : (
          <div className="text text-xs text-white mt-4">{comment.body}</div>
        )}
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center">
          <Button variant="text" onClick={toggleLike}>
            <div className="text text-xs text-white">Like</div>
          </Button>
          <Button variant="text" className="ml-4">
            <div className="text text-xs text-white">Reply</div>
          </Button>
        </div>
        <div className="text text-xs text-white opacity-60">
          {comment.likeIds?.length ?? 0}{" "}
          {comment.likeIds?.length === 1 ? "Like" : "Likes"}
        </div>
      </div>
    </>
  );
};

export default CommentDetail;

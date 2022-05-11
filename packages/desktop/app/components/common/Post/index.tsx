import { FC, Fragment, useState } from "react";
import Link from "next/link";
import Card from "../Card";
import {
  Bell,
  BellSlash,
  ChatCenteredText,
  DotsThreeOutlineVertical,
  EyeClosed,
  Pencil,
  Share,
  ShieldCheck,
  ThumbsUp,
  Trash,
  UserCircleMinus,
  UserCirclePlus,
  WarningOctagon,
  XSquare,
} from "phosphor-react";
import Button from "../Button";
import Avatar from "../Avatar";
import Media from "../Media";
import {
  useHidePost,
  useLikePost,
  useMutePost,
} from "mobile/src/graphql/mutation/posts";
import moment from "moment";
import LikeModal from "./LikesModal";
import CommentPost from "../Comment";
import { PostSummary } from "mobile/src/graphql/fragments/post";
import { useFollowUser } from "mobile/src/graphql/mutation/account";
import { Menu, Transition } from "@headlessui/react";
import ConfirmHideUserModal from "./ConfirmHideUserModal";
import ReportPostModal from "./ReportPostModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { useCachedAccount } from "mobile/src/graphql/query/account/useAccount";

interface PostProps {
  post: PostSummary;
  onClickToEdit?: () => void;
}

const Post: FC<PostProps> = ({ post, onClickToEdit }) => {
  const account = useCachedAccount();
  const [likePost] = useLikePost();
  const [followUser] = useFollowUser();
  const [mutePost] = useMutePost();
  const [hidePost] = useHidePost();

  const [visiblePostLikeModal, setVisiblePostLikeModal] = useState(false);
  const [visibleComment, setVisibleComment] = useState(false);
  const [showHidePost, setShowHidePost] = useState(false);
  const [showReportPost, setShowReportPost] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { user, company, mediaUrl } = post;
  if (!user || !account) {
    // TODO: return skeleton
    return null;
  }

  const isMyPost =
    user?._id === account._id ||
    (company && account.companyIds?.includes(company._id));
  const isFollowingUser = account?.followingIds?.includes(user._id) ?? false;
  const isLiked = account ? post.likeIds?.includes(account._id) : false;
  const isMuted = account?.mutedPostIds?.includes(post._id) ?? false;
  const toggleFollowingUser = async () => {
    await followUser({
      variables: { follow: !isFollowingUser, userId: user._id },
      refetchQueries: ["Account"],
    });
  };
  const toggleLike = async () => {
    await likePost({
      variables: { like: !isLiked, postId: post._id },
      refetchQueries: ["Posts"],
    });
  };
  const toggleMutePost = async () => {
    await mutePost({
      variables: { mute: !isMuted, postId: post._id },
      refetchQueries: ["Account"],
    });
  };
  const hidePostCallback = async () => {
    await hidePost({
      variables: { hide: true, postId: post._id },
      refetchQueries: ["Posts"],
    });
  };

  return (
    <>
      <Card className="border-0 p-0 rounded-none overflow-visible	md:rounded-2xl mb-6">
        <div className="flex items-center px-4 pt-4">
          <Link href={`/profile/${user._id}`}>
            <a>
              <Avatar user={user} size={56} />
            </a>
          </Link>
          <div className="ml-2">
            <div className="flex items-center">
              <Link href={`/profile/${user._id}`}>
                <a className="text-white capitalize">
                  {`${user.firstName} ${user.lastName}`}
                </a>
              </Link>
              {(user.role == "VERIFIED" || user.role == "PROFESSIONAL") && (
                <ShieldCheck
                  className="text-success ml-1.5"
                  color="currentColor"
                  weight="fill"
                  size={16}
                />
              )}
              {user.role == "PROFESSIONAL" && (
                <div className="text-white text-tiny ml-1.5 text-tiny">PRO</div>
              )}
              {!isMyPost && !isFollowingUser && (
                <div className="flex items-center">
                  <div className="mx-1 text-white opacity-60">•</div>
                  <div className="flex">
                    <Button
                      variant="text"
                      className="text-tiny text-primary tracking-wider font-medium py-0"
                      onClick={() => toggleFollowingUser()}
                    >
                      {isFollowingUser ? "Unfollow" : "Follow"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className="text-xs text-white opacity-60">{user.position}</div>
            <div className="text-xs text-white opacity-60">
              {moment(post.createdAt).format("MMM DD")}
            </div>
          </div>
          <div className="self-start ml-auto">
            <Menu as="div" className="relative">
              <Menu.Button className="opacity-60 text-white">
                <DotsThreeOutlineVertical size={24} weight="fill" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute top-8 -right-1 w-60 md:w-96 text-sm text-white/[.87] bg-background-popover shadow-md shadow-black rounded z-10">
                  {!isMyPost ? (
                    <>
                      <Menu.Item>
                        <div
                          className="flex items-center px-4 py-3 cursor-pointer  hover:bg-background-blue"
                          onClick={() => toggleFollowingUser()}
                        >
                          {isFollowingUser ? (
                            <UserCircleMinus
                              fill="currentColor"
                              weight="light"
                              size={24}
                            />
                          ) : (
                            <UserCirclePlus
                              fill="currentColor"
                              weight="light"
                              size={24}
                            />
                          )}
                          {isFollowingUser ? (
                            <div className="ml-4">
                              Unfollow {user.firstName} {user.lastName}
                            </div>
                          ) : (
                            <div className="ml-4">
                              Follow {user.firstName} {user.lastName}
                            </div>
                          )}
                        </div>
                      </Menu.Item>
                      <Menu.Item>
                        <div
                          className="flex items-center px-4 py-3 cursor-pointer hover:bg-background-blue"
                          onClick={() => toggleMutePost()}
                        >
                          {isMuted ? (
                            <Bell
                              fill="currentColor"
                              weight="light"
                              size={24}
                            />
                          ) : (
                            <BellSlash
                              fill="currentColor"
                              weight="light"
                              size={24}
                            />
                          )}
                          {isMuted ? (
                            <div className="ml-4">Turn on notifications</div>
                          ) : (
                            <div className="ml-4">Turn off notifications</div>
                          )}
                        </div>
                      </Menu.Item>
                      <Menu.Item>
                        <div
                          className="flex items-center px-4 py-3 cursor-pointer hover:bg-background-blue"
                          onClick={() => hidePostCallback()}
                        >
                          <XSquare
                            fill="currentColor"
                            weight="light"
                            size={24}
                          />
                          <div className="ml-4">Hide post</div>
                        </div>
                      </Menu.Item>
                      <Menu.Item>
                        <div
                          className="flex items-center px-4 py-3 cursor-pointer hover:bg-background-blue"
                          onClick={() => setShowReportPost(true)}
                        >
                          <WarningOctagon
                            fill="currentColor"
                            weight="light"
                            size={24}
                          />
                          <div className="ml-4">Report post</div>
                        </div>
                      </Menu.Item>
                      {post.user && (
                        <Menu.Item>
                          <div
                            className="flex items-center px-4 py-3 cursor-pointer hover:bg-background-blue"
                            onClick={() => setShowHidePost(true)}
                          >
                            <EyeClosed
                              fill="currentColor"
                              weight="light"
                              size={24}
                            />
                            <div className="ml-4">
                              Hide {post.user.firstName} {post.user.lastName}
                            </div>
                          </div>
                        </Menu.Item>
                      )}
                    </>
                  ) : (
                    <>
                      <Menu.Item>
                        <div
                          className="flex items-center px-4 py-3 cursor-pointer hover:bg-background-blue"
                          onClick={() => onClickToEdit && onClickToEdit()}
                        >
                          <Pencil
                            fill="currentColor"
                            weight="light"
                            size={24}
                          />
                          <div className="ml-4">Edit post</div>
                        </div>
                      </Menu.Item>
                      <Menu.Item>
                        <div
                          className="flex items-center px-4 py-3 cursor-pointer hover:bg-background-blue"
                          onClick={() => toggleMutePost()}
                        >
                          {isMuted ? (
                            <Bell
                              fill="currentColor"
                              weight="light"
                              size={24}
                            />
                          ) : (
                            <BellSlash
                              fill="currentColor"
                              weight="light"
                              size={24}
                            />
                          )}
                          {isMuted ? (
                            <div className="ml-4">Turn on notifications</div>
                          ) : (
                            <div className="ml-4">Turn off notifications</div>
                          )}
                        </div>
                      </Menu.Item>
                      <Menu.Item>
                        <div
                          className="flex items-center px-4 py-3 cursor-pointer hover:bg-background-blue"
                          onClick={() => setShowDeleteConfirm(true)}
                        >
                          <Trash fill="currentColor" weight="light" size={24} />
                          <div className="ml-4">Delete post</div>
                        </div>
                      </Menu.Item>
                    </>
                  )}
                </Menu.Items>
              </Transition>
            </Menu>
            {post.user && (
              <ConfirmHideUserModal
                user={post.user}
                show={showHidePost}
                onClose={() => setShowHidePost(false)}
              />
            )}
            <ReportPostModal
              post={post}
              show={showReportPost}
              onClose={() => setShowReportPost(false)}
            />
          </div>
        </div>
        <div className="text-sm text-white opacity-90 px-4 mt-4">
          {post.body}
        </div>
        <div className="flex flex-wrap -mx-1 mt-3 px-4">
          {post.categories.map((category) => (
            <div
              key={category}
              className={`bg-white/[.25] uppercase rounded-full text-xs text-white font-medium mx-1 my-1 px-4 py-1`}
            >
              {category}
            </div>
          ))}
        </div>
        {mediaUrl && (
          <div className="relative h-auto mt-5 border-b border-white/[.12]">
            <Media src={mediaUrl} />
          </div>
        )}
        <div className="flex items-center p-4">
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
          <div className="w-10 text-white/60 ml-10">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setVisibleComment(!visibleComment)}
            >
              <ChatCenteredText weight="light" color="currentColor" size={24} />
              {post.commentIds && (
                <div className="text-white ml-2 text-xs opacity-60">
                  {post.commentIds.length}
                </div>
              )}
            </div>
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
        {visibleComment && <CommentPost postId={post._id} />}
      </Card>
      <LikeModal
        show={visiblePostLikeModal}
        onClose={() => setVisiblePostLikeModal(false)}
        members={post.likes}
      />
      <ConfirmDeleteModal
        postId={post._id}
        show={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
      />
    </>
  );
};

export default Post;

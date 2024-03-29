import { FC, Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  Bell,
  BellSlash,
  DotsThreeOutlineVertical,
  EyeClosed,
  Pencil,
  Trash,
  WarningOctagon,
  XSquare,
  PushPinSlash,
  PushPin,
} from "phosphor-react";
import ConfirmHideUserModal from "../ConfirmHideUserModal";
import ReportPostModal from "../ReportPostModal";
import { PostSummary } from "shared/graphql/fragments/post";
import { useHidePost, useMutePost } from "shared/graphql/mutation/posts";
import { useFeaturePost } from "shared/graphql/mutation/posts/useFeaturePost";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import FollowUserMenu from "./FollowUserMenu";
import FollowCompanyMenu from "./FollowCompanyMenu";
import { toast } from "desktop/app/components/common/Toast";

interface ActionMenuProps {
  post: PostSummary;
  isMyPost: boolean;
  isMuted: boolean;
  onClickToEdit?: () => void;
}

const ActionMenu: FC<ActionMenuProps> = ({
  post,
  isMyPost,
  isMuted,
  onClickToEdit,
}: ActionMenuProps) => {
  const [showHidePost, setShowHidePost] = useState(false);
  const [showReportPost, setShowReportPost] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [mutePost] = useMutePost();
  const [featurePost] = useFeaturePost();
  const [hidePost] = useHidePost();
  const { user, company } = post;
  const toggleMutePost = async () => {
    const { data } = await mutePost({
      variables: { mute: !isMuted, postId: post._id },
      refetchQueries: ["Account"],
    });
    if (data?.mutePost && !isMuted) {
      toast.success("You won't be notified about updates to this post");
    }
  };
  const hidePostCallback = async () => {
    await hidePost({
      variables: { hide: true, postId: post._id },
      refetchQueries: ["Posts"],
    });
  };
  const togglePinPost = async () => {
    const { data } = await featurePost({
      variables: { postId: post._id, feature: !post.featured },
    });
    data?.featurePost.featured
      ? toast.success("Post pinned to your profile")
      : toast.success("Post unpinned from your profile");
  };
  return (
    <>
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
          <Menu.Items className="absolute top-8 -right-1 w-60 md:w-96 text-sm text-white/[.87] bg-background-popover shadow-md shadow-black rounded overflow-hidden py-2 z-10">
            {!isMyPost ? (
              <>
                <Menu.Item>
                  <div>
                    {user && <FollowUserMenu user={user} />}
                    {company && <FollowCompanyMenu company={company} />}
                  </div>
                </Menu.Item>
                <Menu.Item>
                  <div
                    className="flex items-center text-sm text-white cursor-pointer hover:bg-background-blue px-4 py-3"
                    onClick={() => toggleMutePost()}
                  >
                    {isMuted ? (
                      <Bell fill="currentColor" weight="light" size={24} />
                    ) : (
                      <BellSlash fill="currentColor" weight="light" size={24} />
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
                    className="flex items-center text-sm text-white cursor-pointer hover:bg-background-blue px-4 py-3"
                    onClick={() => hidePostCallback()}
                  >
                    <XSquare fill="currentColor" weight="light" size={24} />
                    <div className="ml-4">Hide post</div>
                  </div>
                </Menu.Item>
                <Menu.Item>
                  <div
                    className="flex items-center text-sm text-white cursor-pointer hover:bg-background-blue px-4 py-3"
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
                <Menu.Item>
                  <div
                    className="flex items-center text-sm text-white cursor-pointer hover:bg-background-blue px-4 py-3"
                    onClick={() => setShowHidePost(true)}
                  >
                    <EyeClosed fill="currentColor" weight="light" size={24} />
                    <div className="ml-4">
                      {company && `Hide ${company.name}`}
                      {user && `Hide ${user.firstName} ${user.lastName}`}
                    </div>
                  </div>
                </Menu.Item>
              </>
            ) : (
              <>
                <Menu.Item>
                  <div
                    className="flex items-center text-sm text-white cursor-pointer hover:bg-background-blue px-4 py-3"
                    onClick={() => onClickToEdit && onClickToEdit()}
                  >
                    <Pencil fill="currentColor" weight="light" size={24} />
                    <div className="ml-4">Edit post</div>
                  </div>
                </Menu.Item>
                <Menu.Item>
                  <div
                    className="flex items-center text-sm text-white cursor-pointer hover:bg-background-blue px-4 py-3"
                    onClick={() => toggleMutePost()}
                  >
                    {isMuted ? (
                      <Bell fill="currentColor" weight="light" size={24} />
                    ) : (
                      <BellSlash fill="currentColor" weight="light" size={24} />
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
                    className="flex items-center text-sm text-white cursor-pointer hover:bg-background-blue px-4 py-3"
                    onClick={() => togglePinPost()}
                  >
                    {post?.featured ? (
                      <PushPinSlash
                        fill="currentColor"
                        weight="light"
                        size={24}
                      />
                    ) : (
                      <PushPin fill="currentColor" weight="light" size={24} />
                    )}
                    {post?.featured ? (
                      <div className="ml-4">Unpin Post from Profile</div>
                    ) : (
                      <div className="ml-4">Pin Post to Profile</div>
                    )}
                  </div>
                </Menu.Item>
                <Menu.Item>
                  <div
                    className="flex items-center text-sm text-white cursor-pointer hover:bg-background-blue px-4 py-3"
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
      {user && (
        <ConfirmHideUserModal
          user={user}
          show={showHidePost}
          onClose={() => setShowHidePost(false)}
        />
      )}
      {showReportPost && (
        <ReportPostModal
          post={post}
          show={showReportPost}
          onClose={() => setShowReportPost(false)}
        />
      )}
      <ConfirmDeleteModal
        postId={post._id}
        show={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
      />
    </>
  );
};

export default ActionMenu;

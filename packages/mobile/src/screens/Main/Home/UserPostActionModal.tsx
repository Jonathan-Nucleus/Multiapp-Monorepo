import React, { useMemo, useState } from 'react';
import {
  Bell,
  BellSlash,
  EyeClosed,
  UserCirclePlus,
  WarningOctagon,
  XSquare,
} from 'phosphor-react-native';

import SelectionModal from 'mobile/src/components/common/SelectionModal';
import { showMessage } from 'mobile/src/services/utils';
import { WHITE } from 'shared/src/colors';
import { SOMETHING_WRONG } from 'shared/src/constants';

import { Post } from 'mobile/src/graphql/query/post/usePosts';
import {
  useFollowUser,
  useHideUser,
} from 'mobile/src/graphql/mutation/account';
import { useAccount } from 'mobile/src/graphql/query/account';
import {
  useHidePost,
  useMutePost,
  useReportPost,
} from 'mobile/src/graphql/mutation/posts';

import ReportPostModal from './ReportPostModal';

interface UserPostActionModalProps {
  post?: Post;
  visible: boolean;
  onClose?: () => void;
}

const UserPostActionModal: React.FC<UserPostActionModalProps> = ({
  post,
  visible,
  onClose,
}) => {
  if (!post) return null;

  const { user, company } = post;
  const [reportPostModalVisible, setReportPostModalVisible] = useState(false);

  const { data: accountData } = useAccount();
  const [followUser] = useFollowUser();
  const [hideUser] = useHideUser();
  const [hidePost] = useHidePost();
  const [mutePost] = useMutePost();
  const [reportPost] = useReportPost();

  const isMuted =
    accountData?.account?.mutedPostIds?.includes(post._id) ?? false;

  const isFollowing = accountData?.account?.followingIds?.includes(
    user?._id ?? '',
  );

  const menuData = useMemo(() => {
    const menuArray = [
      user
        ? {
            label: `${isFollowing ? 'Unfollow' : 'Follow'} ${user.firstName} ${
              user.lastName
            }`,
            icon: <UserCirclePlus size={26} color={WHITE} />,
            key: 'follow' as const,
          }
        : {
            label: `Follow ${company?.name}`,
            icon: <UserCirclePlus size={26} color={WHITE} />,
            key: 'follow' as const,
          },
      isMuted
        ? {
            label: 'Turn on notifications for this post',
            icon: <Bell size={26} color={WHITE} />,
            key: 'mute' as const,
          }
        : {
            label: 'Turn off notifications for this post',
            icon: <BellSlash size={26} color={WHITE} />,
            key: 'mute' as const,
          },
      {
        label: 'Hide post',
        icon: <XSquare size={26} color={WHITE} />,
        key: 'hidePost' as const,
      },
      {
        label: 'Report post',
        icon: <WarningOctagon size={26} color={WHITE} />,
        key: 'report' as const,
      },
      ...(user // Only supported for users, not company posts
        ? [
            {
              label: `Hide ${user.firstName} ${user.lastName}`,
              icon: <EyeClosed size={26} color={WHITE} />,
              key: 'hide' as const,
            },
          ]
        : []),
    ];

    return menuArray;
  }, [user, accountData, isMuted, isFollowing]);

  const handleFollowUser = async () => {
    if (!user) return; // TODO: Update to support companies

    try {
      const { data } = await followUser({
        variables: { follow: !isFollowing, userId: user._id },
      });

      data?.followUser
        ? showMessage(
            'success',
            isFollowing
              ? `You’re unfollowing ${user.firstName} ${user.lastName}`
              : `You’re following ${user.firstName} ${user.lastName}`,
          )
        : showMessage('error', SOMETHING_WRONG);
    } catch (err) {
      showMessage('error', SOMETHING_WRONG);
    }
  };

  const handleHideUser = async () => {
    if (!user) return;

    try {
      const { data } = await hideUser({
        variables: { hide: true, userId: user._id },
      });

      data?.hideUser
        ? showMessage(
            'success',
            `You will not be able to see posts from ${user.firstName} ${user.lastName} anymore`,
          )
        : showMessage('error', SOMETHING_WRONG);
    } catch (err) {
      showMessage('error', SOMETHING_WRONG);
    }
  };

  const handleHidePost = async () => {
    try {
      const { data } = await hidePost({
        variables: { hide: true, postId: post._id },
      });

      data?.hidePost
        ? showMessage('info', 'You will not be able to see this post anymore.')
        : showMessage('error', SOMETHING_WRONG);
    } catch (err) {
      showMessage('error', SOMETHING_WRONG);
    }
  };

  const handleMutePost = async () => {
    try {
      const { data } = await mutePost({
        variables: { mute: !isMuted, postId: post._id },
      });

      data?.mutePost
        ? showMessage(
            'info',
            !isMuted
              ? "You won't be notified about this post."
              : 'You will be notified about this post.',
          )
        : showMessage('error', SOMETHING_WRONG);
    } catch (err) {
      showMessage('error', SOMETHING_WRONG);
    }
  };

  const handleReportPost = async (violations: string[], comment: string) => {
    try {
      const { data } = await reportPost({
        variables: {
          report: {
            violations,
            comments: comment,
            postId: post._id,
          },
        },
      });

      data?.reportPost
        ? showMessage('info', 'Thanks for letting us know')
        : showMessage('error', SOMETHING_WRONG);
    } catch (err) {
      showMessage('error', SOMETHING_WRONG);
    }
  };

  return (
    <>
      <SelectionModal
        isVisible={visible}
        dataArray={menuData}
        buttonLabel="Cancel"
        onPressCancel={onClose}
        onPressItem={(key) => {
          onClose?.();

          switch (key) {
            case 'follow':
              return handleFollowUser();
            case 'hide':
              return handleHideUser();
            case 'hidePost':
              return handleHidePost();
            case 'report':
              return setTimeout(() => setReportPostModalVisible(true), 500);
            case 'mute':
              return handleMutePost();
          }
        }}
      />
      <ReportPostModal
        isVisible={reportPostModalVisible}
        onPressCancel={() => setReportPostModalVisible(false)}
        onPressConfirm={(violations, comment) => {
          handleReportPost(violations, comment);
          setReportPostModalVisible(false);
        }}
      />
    </>
  );
};

export default UserPostActionModal;

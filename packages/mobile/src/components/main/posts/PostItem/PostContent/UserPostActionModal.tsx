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
import { showMessage } from 'mobile/src/services/ToastService';
import { WHITE } from 'shared/src/colors';
import { SOMETHING_WRONG } from 'shared/src/constants';

import { Post } from 'shared/graphql/query/post/usePosts';
import { useHideUser } from 'shared/graphql/mutation/account';
import { useFollowUser } from 'shared/graphql/mutation/account/useFollowUser';
import { useAccount } from 'shared/graphql/query/account/useAccount';
import {
  useHidePost,
  useMutePost,
  useReportPost,
} from 'shared/graphql/mutation/posts';

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
  const { user, company } = post || {};
  const [reportPostModalVisible, setReportPostModalVisible] = useState(false);

  const { data: accountData } = useAccount();
  const { isFollowing, toggleFollow } = useFollowUser(user?._id);
  const [hideUser] = useHideUser();
  const [hidePost] = useHidePost();
  const [mutePost] = useMutePost();
  const [reportPost] = useReportPost();

  const isMuted =
    (post && accountData?.account?.mutedPostIds?.includes(post._id)) ?? false;

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
  }, [user, isMuted, isFollowing, company?.name]);

  if (!post) {
    return null;
  }

  const handleFollowUser = async () => {
    if (!user) {
      return;
    }

    const result = await toggleFollow();
    result
      ? showMessage(
          'success',
          isFollowing
            ? `You’re unfollowing ${user.firstName} ${user.lastName}`
            : `You’re following ${user.firstName} ${user.lastName}`,
        )
      : showMessage('error', SOMETHING_WRONG);
  };

  const handleHideUser = async () => {
    if (!user) {
      return;
    }

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

  const handlePressReportPost = (): void => {
    setTimeout(() => {
      setReportPostModalVisible(true);
    }, 400); // it should be greater than the timing of Modal animation
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
        ? showMessage('success', 'Thanks for letting us know')
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
            case 'mute':
              return handleMutePost();
            case 'report':
              return handlePressReportPost();
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

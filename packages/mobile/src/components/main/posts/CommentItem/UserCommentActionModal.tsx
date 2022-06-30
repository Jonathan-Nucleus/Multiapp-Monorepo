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

import { Comment } from 'shared/graphql/query/post/usePost';
import { useHideUser } from 'shared/graphql/mutation/account';
import { useFollowUser } from 'shared/graphql/mutation/account/useFollowUser';
import { useAccount } from 'shared/graphql/query/account/useAccount';
import {
  useHidePost,
  useMutePost,
  useReportPost,
} from 'shared/graphql/mutation/posts';

interface UserCommentActionModalProps {
  comment?: Comment;
  visible: boolean;
  onClose?: () => void;
}

const UserCommentActionModal: React.FC<UserCommentActionModalProps> = ({
  comment,
  visible,
  onClose,
}) => {
  if (!comment) {
    return null;
  }

  const { user } = comment;
  const [reportPostModalVisible, setReportPostModalVisible] = useState(false);

  const { data: accountData } = useAccount();
  const { isFollowing, toggleFollow } = useFollowUser(user._id);
  const [hideUser] = useHideUser();

  const menuData = [
    {
      label: `${isFollowing ? 'Unfollow' : 'Follow'} ${user.firstName} ${
        user.lastName
      }`,
      icon: <UserCirclePlus size={32} color={WHITE} />,
      key: 'follow',
    },
    {
      label: 'Report comment',
      icon: <WarningOctagon size={32} color={WHITE} />,
      key: 'report',
    },
    {
      label: `Hide ${user.firstName} ${user.lastName}`,
      icon: <EyeClosed size={32} color={WHITE} />,
      key: 'hide',
    },
  ];

  const handleFollowUser = async () => {
    if (!user) return;

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

  /*const handleReportComment = async (violations: string[], comment: string) => {
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
  };*/

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
          }
        }}
      />
    </>
  );
};

export default UserCommentActionModal;

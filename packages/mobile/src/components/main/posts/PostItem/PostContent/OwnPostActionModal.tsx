import React, { useMemo } from 'react';
import {
  Pencil,
  Trash,
  BellSlash,
  PushPin,
  PushPinSlash,
  Bell,
} from 'phosphor-react-native';

import SelectionModal from 'mobile/src/components/common/SelectionModal';
import { showMessage } from 'mobile/src/services/ToastService';
import * as NavigationService from 'mobile/src/services/navigation/NavigationService';
import { WHITE } from 'shared/src/colors';
import { SOMETHING_WRONG } from 'shared/src/constants';

import { Post } from 'shared/graphql/query/post/usePosts';
import { useMutePost } from 'shared/graphql/mutation/posts';
import { useDeletePost } from 'shared/graphql/mutation/posts/useDeletePost';
import { useFeaturePost } from 'shared/graphql/mutation/posts/useFeaturePost';
import { useAccountContext } from 'shared/context/Account';

interface OwnPostActionModalProps {
  post?: Post;
  visible: boolean;
  onClose?: () => void;
}

const OwnPostActionModal: React.FC<OwnPostActionModalProps> = ({
  post,
  visible,
  onClose,
}) => {
  const [mutePost] = useMutePost();
  const [deletePost] = useDeletePost();
  const [featurePost] = useFeaturePost();
  const account = useAccountContext();
  const isMuted = (post && account?.mutedPostIds?.includes(post._id)) ?? false;
  const menuData = useMemo(
    () => [
      {
        label: 'Edit Post',
        icon: <Pencil size={26} color={WHITE} />,
        key: 'edit' as const,
      },
      {
        label: 'Delete Post',
        icon: <Trash size={26} color={WHITE} />,
        key: 'delete' as const,
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
        label: post?.featured
          ? 'Unpin Post from Profile'
          : 'Pin Post to Profile',
        icon: post?.featured ? (
          <PushPinSlash size={26} color={WHITE} />
        ) : (
          <PushPin size={26} color={WHITE} />
        ),
        key: 'togglePin' as const,
      },
    ],
    [post],
  );

  if (!post) {
    return null;
  }

  const handleEditPost = (): void => {
    NavigationService.navigate('PostDetails', {
      screen: 'CreatePost',
      params: {
        post,
      },
    });
  };

  const handleDeletePost = async (): Promise<void> => {
    try {
      const { data } = await deletePost({
        variables: { postId: post._id },
      });

      if (data?.deletePost) {
        showMessage('success', 'This post has been successfully deleted.');
        NavigationService.navigate('Authenticated', {
          screen: 'Main',
          params: {
            screen: 'Home',
            params: {
              refreshToken: new Date().toISOString(),
            },
          },
        });
      } else {
        showMessage('error', SOMETHING_WRONG);
      }
    } catch (err) {
      showMessage('error', SOMETHING_WRONG);
    }
  };

  const handleMutePost = async (): Promise<void> => {
    try {
      const { data } = await mutePost({
        variables: { mute: true, postId: post._id },
      });

      data?.mutePost
        ? showMessage('info', "You won't be notified about this post.")
        : showMessage('error', SOMETHING_WRONG);
    } catch (err) {
      showMessage('error', SOMETHING_WRONG);
    }
  };

  const handleTogglePin = async (): Promise<void> => {
    try {
      const { data } = await featurePost({
        variables: { postId: post._id, feature: !post.featured },
      });
      data?.featurePost.featured
        ? showMessage('info', 'Post pinned to your profile')
        : showMessage('info', 'Post unpinned from your profile');
    } catch (err) {
      showMessage('error', SOMETHING_WRONG);
    }
  };
  return (
    <SelectionModal
      isVisible={visible}
      dataArray={menuData}
      buttonLabel="Cancel"
      onPressCancel={onClose}
      onPressItem={(key) => {
        onClose?.();

        switch (key) {
          case 'edit':
            return handleEditPost();
          case 'delete':
            return handleDeletePost();
          case 'mute':
            return handleMutePost();
          case 'togglePin':
            return handleTogglePin();
        }
      }}
    />
  );
};

export default OwnPostActionModal;

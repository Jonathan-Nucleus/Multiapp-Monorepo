import React, { useMemo } from 'react';
import { Pencil, Trash, BellSlash } from 'phosphor-react-native';

import SelectionModal from 'mobile/src/components/common/SelectionModal';
import { showMessage } from 'mobile/src/services/utils';
import * as NavigationService from 'mobile/src/services/navigation/NavigationService';
import { WHITE } from 'shared/src/colors';
import { SOMETHING_WRONG } from 'shared/src/constants';

import { Post } from 'shared/graphql/query/post/usePosts';
import { useMutePost } from 'shared/graphql/mutation/posts';
import { useDeletePost } from 'shared/graphql/mutation/posts/useDeletePost';

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
      {
        label: 'Turn off notifications for this post',
        icon: <BellSlash size={26} color={WHITE} />,
        key: 'mute' as const,
      },
    ],
    [],
  );

  if (!post) {
    return null;
  }

  const handleEditPost = () => {
    NavigationService.navigate('PostDetails', {
      screen: 'CreatePost',
      params: {
        post,
      },
    });
  };

  const handleDeletePost = async () => {
    try {
      const { data } = await deletePost({
        variables: { postId: post._id },
      });

      data?.deletePost
        ? showMessage('success', 'This post has been successfully deleted.')
        : showMessage('error', SOMETHING_WRONG);
    } catch (err) {
      showMessage('error', SOMETHING_WRONG);
    }
  };

  const handleMutePost = async () => {
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
        }
      }}
    />
  );
};

export default OwnPostActionModal;

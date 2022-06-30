import React, { useMemo } from 'react';
import { Pencil, Trash, BellSlash } from 'phosphor-react-native';

import SelectionModal from 'mobile/src/components/common/SelectionModal';
import { showMessage } from 'mobile/src/services/utils';
import { WHITE } from 'shared/src/colors';
import { SOMETHING_WRONG } from 'shared/src/constants';

import { Comment } from 'shared/graphql/query/post/usePost';
import { useDeleteComment } from 'shared/graphql/mutation/posts';

interface OwnCommentActionModalProps {
  comment?: Comment;
  visible: boolean;
  onClose?: () => void;
  onEditComment?: () => void;
}

const menuData = [
  {
    label: 'Edit Comment',
    icon: <Pencil size={26} color={WHITE} />,
    key: 'edit',
  },
  {
    label: 'Delete Comment',
    icon: <Trash size={26} color={WHITE} />,
    key: 'delete',
  },
];

const OwnCommentActionModal: React.FC<OwnCommentActionModalProps> = ({
  comment,
  visible,
  onClose,
  onEditComment,
}) => {
  if (!comment) return null;

  const { user } = comment;
  const [deleteComment] = useDeleteComment();

  const handleEditComment = () => {
    console.log('Editing comment');
    onEditComment?.();
  };

  const handleDeleteComment = async () => {
    if (!comment) {
      return;
    }

    try {
      const { data } = await deleteComment({
        variables: { commentId: comment._id },
      });

      data?.deleteComment
        ? showMessage('success', 'This comment has been successfully deleted.')
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
            return handleEditComment();
          case 'delete':
            return handleDeleteComment();
        }
      }}
    />
  );
};

export default OwnCommentActionModal;

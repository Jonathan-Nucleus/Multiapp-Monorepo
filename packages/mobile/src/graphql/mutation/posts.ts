import { gql, useMutation, MutationTuple } from '@apollo/client';
import { MediaUpload, MediaType } from 'backend/graphql/mutations.graphql';
import { Post, PostInput } from 'backend/graphql/posts.graphql';
import { FetchPostsData } from 'mobile/src/graphql/query/account';
import { VIEW_POST_FRAGMENT } from 'mobile/src/graphql/query/post';
import { Comment } from "backend/graphql/comments.graphql";

export const CREATE_POST = gql`
  mutation CreatePost($post: PostInput!) {
    createPost(post: $post) {
      _id
      categories
      audience
      body
      mediaUrl
      mentionIds
    }
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($like: Boolean!, $postId: ID!) {
    likePost(like: $like, postId: $postId) {
      _id
      likeIds
    }
  }
`;

export const HIDE_POST = gql`
  mutation HidePost($postId: ID!) {
    hidePost(postId: $postId)
  }
`;

export const MUTE_POST = gql`
  mutation MutePost($mute: Boolean!, $postId: ID!) {
    mutePost(mute: $mute, postId: $postId)
  }
`;

export const EDIT_COMMENT = gql`
  mutation EditComment($comment: CommentUpdate!) {
    editComment(comment: $comment) {
      _id
      body
      postId
      createdAt
    }
  }
`;

type UploadLinkVariables = {
  localFilename: string;
  type: MediaType;
};

type UploadLinkData = {
  uploadLink: MediaUpload | null;
};

/**
 * GraphQL mutation that resets a user's password
 *
 * @returns   GraphQL mutation.
 */
export function useFetchUploadLink(): MutationTuple<
  UploadLinkData,
  UploadLinkVariables
> {
  return useMutation<UploadLinkData, UploadLinkVariables>(gql`
    mutation UploadLink($localFilename: String!, $type: MediaType!) {
      uploadLink(localFilename: $localFilename, type: $type) {
        remoteName
        uploadUrl
      }
    }
  `);
}

type CreatePostVariables = {
  post: PostInput;
};

type CreatePostData = {
  createPost?: Exclude<FetchPostsData['posts'], undefined>[number];
};

/**
 * GraphQL mutation that creates a new post.
 *
 * @returns   GraphQL mutation.
 */
export function useCreatePost(): MutationTuple<
  CreatePostData,
  CreatePostVariables
> {
  return useMutation<CreatePostData, CreatePostVariables>(
    gql`
      ${VIEW_POST_FRAGMENT}
      mutation CreatePost($post: PostInput!) {
        createPost(post: $post) {
          ...ViewPostFields
        }
      }
    `,
    {
      refetchQueries: ['Posts'],
    },
  );
}

type LikePostVariables = {
  like: boolean;
  postId: string;
};

type LikePostData = {
  likePost: Pick<Post, '_id' | 'likeIds'>;
};

/**
 * GraphQL mutation that resets a user's password
 *
 * @returns   GraphQL mutation.
 */
export function useLikePost(): MutationTuple<LikePostData, LikePostVariables> {
  return useMutation<LikePostData, LikePostVariables>(LIKE_POST);
}

type CommentPostVariables = {
  comment: {
    body: string;
    postId: string;
    mentionIds: string[];
    commentId?: string;
  };
};

type CommentPostData = {
  comment: any;
};

/**
 * GraphQL mutation that resets a user's password
 *
 * @returns   GraphQL mutation.
 */
export function useCommentPost(): MutationTuple<
  CommentPostData,
  CommentPostVariables
> {
  return useMutation<CommentPostData, CommentPostVariables>(gql`
    mutation Comment($comment: CommentInput!) {
      comment(comment: $comment) {
        _id
        body
        likeIds
        mentions {
          _id
          firstName
          lastName
        }
      }
    }
  `);
}

type EditCommentPostVariables = {
  comment: {
    _id: string;
    body: string;
    mentionIds: string[];
  };
};

type EditCommentPostData = {
  editComment: Comment;
};

export function useEditCommentPost(): MutationTuple<
  EditCommentPostData,
  EditCommentPostVariables
> {
  return useMutation<EditCommentPostData, EditCommentPostVariables>(gql`
    mutation EditComment($comment: CommentUpdate!) {
      editComment(comment: $comment) {
        _id
        body
        postId
        createdAt
      }
    }
  `);
}

type DeleteCommentVariables = {
  commentId: string;
};

type DeleteCommentData = {
  deleteComment: boolean;
};

/**
 * GraphQL mutation that deletes comment
 *
 * @returns   GraphQL mutation.
 */
export function useDeleteComment(): MutationTuple<
  DeleteCommentData,
  DeleteCommentVariables
> {
  return useMutation<DeleteCommentData, DeleteCommentVariables>(gql`
    mutation DeleteComment($commentId: ID!) {
      deleteComment(commentId: $commentId)
    }
  `);
}

type HidePostVariables = {
  hide: boolean;
  postId: string;
};

type HidePostData = {
  hidePost: boolean;
};

/**
 * GraphQL mutation that hides post
 *
 * @returns   GraphQL mutation.
 */
export function useHidePost(): MutationTuple<HidePostData, HidePostVariables> {
  return useMutation<HidePostData, HidePostVariables>(gql`
    mutation HidePost($hide: Boolean!, $postId: ID!) {
      hidePost(hide: $hide, postId: $postId)
    }
  `);
}

interface ReportedPost {
  violations: string[];
  comments: string;
  postId: string;
}

type ReportPostVariables = {
  report: ReportedPost;
};

type ReportPostData = {
  reportPost: boolean;
};

/**
 * GraphQL mutation that reports post
 *
 * @returns   GraphQL mutation.
 */
export function useReportPost(): MutationTuple<
  ReportPostData,
  ReportPostVariables
> {
  return useMutation<ReportPostData, ReportPostVariables>(gql`
    mutation ReportPost($report: ReportedPostInput!) {
      reportPost(report: $report)
    }
  `);
}

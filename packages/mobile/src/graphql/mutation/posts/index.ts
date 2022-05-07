import { gql, useMutation, MutationTuple } from '@apollo/client';
import type { MediaUpload, MediaType } from 'backend/graphql/mutations.graphql';
import type { PostInput, PostCategory } from 'backend/graphql/posts.graphql';
import type { Comment } from 'backend/graphql/comments.graphql';
import { PostCategories } from 'backend/graphql/enumerations.graphql';
import {
  POST_SUMMARY_FRAGMENT,
  PostSummary,
} from 'mobile/src/graphql/fragments/post';

export type { PostCategory };
export { PostCategories };

type UploadLinkVariables = {
  localFilename: string;
  type: MediaType;
};

type UploadLinkData = {
  uploadLink: MediaUpload | null;
};

/**
 * GraphQL mutation that upload link
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

type Post = PostSummary;
type CreatePostData = {
  createPost?: Post;
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
      ${POST_SUMMARY_FRAGMENT}
      mutation CreatePost($post: PostInput!) {
        createPost(post: $post) {
          ...PostSummaryFields
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
  likePost: Pick<PostSummary, '_id' | 'likeIds'>;
};

/**
 * GraphQL mutation that like post
 *
 * @returns   GraphQL mutation.
 */
export function useLikePost(): MutationTuple<LikePostData, LikePostVariables> {
  return useMutation<LikePostData, LikePostVariables>(gql`
    mutation LikePost($like: Boolean!, $postId: ID!) {
      likePost(like: $like, postId: $postId) {
        _id
        likeIds
      }
    }
  `);
}

type CommentPostVariables = {
  comment: {
    postId: string;
    commentId?: string;
    mediaUrl?: string;
    body: string;
    mentionIds?: string[];
  };
};

type CommentPostData = {
  comment: any;
};

/**
 * GraphQL mutation that  comment post
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
        mediaUrl
      }
    }
  `);
}

type EditCommentPostVariables = {
  comment: {
    _id: string;
    body: string;
    mentionIds: string[];
    mediaUrl?: string;
  };
};

type EditCommentPostData = {
  editComment: Comment;
};

export function useEditCommentPost(): MutationTuple<
  EditCommentPostData,
  EditCommentPostVariables
> {
  return useMutation<EditCommentPostData, EditCommentPostVariables>(
    gql`
      mutation EditComment($comment: CommentUpdate!) {
        editComment(comment: $comment) {
          _id
          body
          postId
          createdAt
          mediaUrl
        }
      }
    `,
    {
      refetchQueries: ['Post'],
    },
  );
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
  return useMutation<DeleteCommentData, DeleteCommentVariables>(
    gql`
      mutation DeleteComment($commentId: ID!) {
        deleteComment(commentId: $commentId)
      }
    `,
    {
      refetchQueries: ['Post'],
    },
  );
}

type LikeCommentVariables = {
  like: boolean;
  commentId: string;
};

type LikeCommentData = {
  likeComment: {
    _id: string;
    likeIds: string[];
  };
};

/**
 * GraphQL mutation that like comment
 *
 * @returns   GraphQL mutation.
 */
export function useLikeComment(): MutationTuple<
  LikeCommentData,
  LikeCommentVariables
> {
  return useMutation<LikeCommentData, LikeCommentVariables>(
    gql`
      mutation LikeComment($like: Boolean!, $commentId: ID!) {
        likeComment(like: $like, commentId: $commentId) {
          _id
          likeIds
        }
      }
    `,
    {
      refetchQueries: ['Post'],
    },
  );
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
  return useMutation<HidePostData, HidePostVariables>(
    gql`
      mutation HidePost($hide: Boolean!, $postId: ID!) {
        hidePost(hide: $hide, postId: $postId)
      }
    `,
    { refetchQueries: ['Account', 'Posts', 'Post'] },
  );
}

type MutePostVariables = {
  mute: boolean;
  postId: string;
};

type MutePostData = {
  mutePost: boolean;
};

/**
 * GraphQL mutation that mutes post
 *
 * @returns   GraphQL mutation.
 */
export function useMutePost(): MutationTuple<MutePostData, MutePostVariables> {
  return useMutation<MutePostData, MutePostVariables>(
    gql`
      mutation MutePost($mute: Boolean!, $postId: ID!) {
        mutePost(mute: $mute, postId: $postId)
      }
    `,
    {
      refetchQueries: ['Account', 'Post'],
    },
  );
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

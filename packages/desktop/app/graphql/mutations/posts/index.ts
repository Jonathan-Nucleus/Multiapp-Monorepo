import { gql, useMutation, MutationTuple } from "@apollo/client";
import { MediaUpload, MediaType } from "backend/graphql/mutations.graphql";
import { Post, PostInput } from "backend/graphql/posts.graphql";
import type { Comment } from "backend/graphql/comments.graphql";
import { VIEW_POST_FRAGMENT } from "mobile/src/graphql/query/account";
import { PostType } from "desktop/app/types/common-props";

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
  createPost?: PostType;
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
      refetchQueries: ["Posts"],
    }
  );
}

type LikePostVariables = {
  like: boolean;
  postId: string;
};

type LikePostData = {
  likePost: Pick<Post, "_id" | "likeIds">;
};

/**
 * GraphQL mutation that resets a user's password
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
    body: string;
    postId: string;
    mentionIds: string[];
    commentId?: string;
  };
};

type CommentPostData = {
  comment: Comment;
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

type DeleteCommentVariables = {
  commentId: string;
};

type DeleteCommentData = {
  deleteComment: boolean;
};

/**
 * GraphQL mutation that resets a user's password
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

/**
 * GraphQL mutation that resets a user's password
 *
 * @returns   GraphQL mutation.
 */
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

// TODO
// delete
// comment
// Report

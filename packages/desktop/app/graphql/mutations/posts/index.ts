import { gql, useMutation, MutationTuple } from "@apollo/client";
import { MediaUpload } from "backend/graphql/mutations.graphql";

import { Post } from "backend/graphql/posts.graphql";

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
    likePost(like: $like, postId: $postId)
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
    mutation UploadLink($localFilename: String!) {
      uploadLink(localFilename: $localFilename) {
        remoteName
        uploadUrl
      }
    }
  `);
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

// TODO
// delete
// comment
// Report

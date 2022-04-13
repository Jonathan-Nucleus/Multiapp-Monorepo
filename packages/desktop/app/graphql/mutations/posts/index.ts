import { gql, useMutation, MutationTuple } from "@apollo/client";
import { MediaUpload, MediaType } from "backend/graphql/mutations.graphql";
import { Post, PostInput } from "backend/graphql/posts.graphql";
import {
  VIEW_POST_FRAGMENT,
  FetchPostsData,
} from "desktop/app/graphql/queries";

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
  createPost?: Exclude<FetchPostsData["posts"], undefined>[number];
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

// TODO
// delete
// comment
// Report

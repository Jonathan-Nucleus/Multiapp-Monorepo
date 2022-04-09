import { gql } from "@apollo/client";

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

// TODO
// delete
// comment
// Report

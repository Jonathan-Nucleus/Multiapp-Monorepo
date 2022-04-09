import { gql } from '@apollo/client';

export interface PostDataType {
  _id?: string;
  categories: string[];
  audience?: string;
  body: string;
  mediaUrl: string;
  mentionIds?: string[];
  user?: UserType;
}

export interface UserType {
  firstName: string;
  lastName: string;
}

export const CREATE_POST = gql`
  mutation CreatePost($post: PostInput!) {
    createPost(post: $post) {
      _id
      audience
      body
    }
  }
`;

export const GET_POSTS = gql`
  query Posts {
    posts {
      _id
      body
      categories
      mediaUrl
      mentionIds
      likeIds
      commentIds
      createdAt
      user {
        _id
        firstName
        lastName
      }
    }
  }
`;

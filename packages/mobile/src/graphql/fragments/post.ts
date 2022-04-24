import { gql } from '@apollo/client';
import { Post } from 'backend/graphql/posts.graphql';

export type PostSummary = Pick<
  Post,
  | '_id'
  | 'body'
  | 'categories'
  | 'mediaUrl'
  | 'mentionIds'
  | 'likeIds'
  | 'shareIds'
  | 'commentIds'
  | 'createdAt'
> & {
  user: Pick<
    Post['user'],
    '_id' | 'firstName' | 'lastName' | 'avatar' | 'position' | 'role'
  > & {
    company: Pick<Exclude<Post['user']['company'], undefined>, 'name'>;
  };
};

export const POST_SUMMARY_FRAGMENT = gql`
  fragment PostSummaryFields on Post {
    _id
    body
    categories
    mediaUrl
    mentionIds
    likeIds
    shareIds
    commentIds
    createdAt
    user {
      _id
      firstName
      lastName
      avatar
      position
      role
      company {
        name
      }
    }
  }
`;
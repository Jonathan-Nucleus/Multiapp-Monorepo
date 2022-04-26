import { gql, useQuery, QueryResult } from '@apollo/client';
import { UserProfile } from 'backend/graphql/users.graphql';
import { Post as GraphQLPost } from 'backend/graphql/posts.graphql';
import { Company as GraphQLCompany } from 'backend/graphql/companies.graphql';
import {
  POST_SUMMARY_FRAGMENT,
  PostSummary,
} from 'mobile/src/graphql/fragments/post';

export type Like = Pick<
  UserProfile,
  '_id' | 'firstName' | 'lastName' | 'avatar' | 'position'
> & {
  company?: Pick<
    Exclude<GraphQLPost['likes'][number]['company'], undefined>,
    'name'
  >;
};

export type Comment = Pick<
  GraphQLPost['comments'][number],
  '_id' | 'body' | 'commentId' | 'likeIds' | 'createdAt'
> & {
  user: Pick<
    GraphQLPost['comments'][number]['user'],
    '_id' | 'firstName' | 'lastName' | 'avatar' | 'position'
  > & {
    company: Pick<GraphQLCompany, 'name'>;
  };
  likes: Like[];
};

export type Post = PostSummary & {
  mentions: Pick<
    GraphQLPost['mentions'][number],
    '_id' | 'firstName' | 'lastName'
  >[];
  likes: Like[];
  comments: Comment[];
};

type PostVariables = {
  postId: string;
};
export type PostData = {
  post?: Post;
};

/**
 * GraphQL query that fetches data for a specific post.
 *
 * @returns   GraphQL query.
 */
export function usePost(postId?: string): QueryResult<PostData, PostVariables> {
  return useQuery<PostData, PostVariables>(
    gql`
      ${POST_SUMMARY_FRAGMENT}
      query Post($postId: ID!) {
        post(postId: $postId) {
          ...PostSummaryFields
          mentions {
            _id
            firstName
            lastName
          }
          likes {
            _id
            firstName
            lastName
            avatar
            company {
              name
            }
          }
          comments {
            _id
            body
            commentId
            createdAt
            user {
              _id
              firstName
              lastName
              avatar
              position
              company {
                name
              }
            }
            likeIds
            likes {
              _id
              firstName
              lastName
              avatar
            }
          }
        }
      }
    `,
    {
      skip: !postId,
      variables: { postId: postId ?? '' },
    },
  );
}

import { gql, QueryResult, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Post } from "./usePost";

export type PostCommentsData = {
  post: Post;
};

type PostCommentsVariables = {
  postId: string;
};

export function usePostComments(
  postId?: string
): QueryResult<PostCommentsData, PostCommentsVariables> {
  const [state, setState] = useState<PostCommentsData>();
  const { data, loading, ...rest } = useQuery<
    PostCommentsData,
    PostCommentsVariables
  >(
    gql`
      query Post($postId: ID!) {
        post(postId: $postId) {
          comments {
            _id
            body
            commentId
            createdAt
            mediaUrl
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
      variables: { postId: postId ?? "" },
    }
  );
  useEffect(() => {
    if (!loading && data) {
      setState(data);
    }
  }, [data, loading]);
  return { data: state, loading, ...rest };
}

import { gql, QueryResult, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Post } from "./usePost";

export type PostLikesData = {
  post: Post;
};

type PostLikesVariables = {
  postId: string;
};

export function usePostLikes(
  postId?: string
): QueryResult<PostLikesData, PostLikesVariables> {
  const [state, setState] = useState<PostLikesData>();
  const { data, loading, ...rest } = useQuery<PostLikesData, PostLikesVariables>(
    gql`
      query Post($postId: ID!) {
        post(postId: $postId) {
          likes {
            _id
            firstName
            lastName
            avatar
            company {
              name
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

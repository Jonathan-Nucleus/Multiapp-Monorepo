import { gql, QueryResult, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { UserProfile } from "backend/graphql/users.graphql";
import { Post as GraphQLPost } from "backend/graphql/posts.graphql";

export type Like = Pick<
  UserProfile,
  "_id" | "firstName" | "lastName" | "avatar" | "position"
> & {
  company?: Pick<
    Exclude<GraphQLPost["likes"][number]["company"], undefined>,
    "name"
  >;
};

export type Post = Pick<GraphQLPost, "_id"> & {
  likes: Like[];
};

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
  const { data, loading, ...rest } = useQuery<
    PostLikesData,
    PostLikesVariables
  >(
    gql`
      query Post($postId: ID!) {
        post(postId: $postId) {
          _id
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
      notifyOnNetworkStatusChange: true,
    }
  );
  useEffect(() => {
    if (!loading && data) {
      setState(data);
    }
  }, [data, loading]);
  return { data: state, loading, ...rest };
}

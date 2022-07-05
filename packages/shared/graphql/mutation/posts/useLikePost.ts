import { useState, useRef, useCallback, useEffect } from "react";
import { gql, useMutation, useApolloClient } from "@apollo/client";
import { useAccountContext } from "shared/context/Account";
import {
  POST_SUMMARY_FRAGMENT,
  PostSummary,
} from "shared/graphql/fragments/post";

type LikePostVariables = {
  like: boolean;
  postId: string;
};

type LikePostData = {
  likePost: Pick<PostSummary, "_id" | "likeIds" | "likeCount">;
};

interface LikePostReturn {
  isLiked: boolean;
  toggleLike: () => Promise<boolean>;
  like: (like: boolean) => Promise<boolean>;
  likeCount: number;
}

/**
 * GraphQL mutation that like post
 *
 * @returns   GraphQL mutation.
 */
export function useLikePost(id: string): LikePostReturn {
  const account = useAccountContext();
  const client = useApolloClient();
  const post = client.readFragment({
    id: `Post:${id}`,
    fragment: gql`
      ${POST_SUMMARY_FRAGMENT}
    `,
  }) as PostSummary | null;

  const isLiked = post?.likeIds?.includes(account._id) ?? false;
  const [liked, setLiked] = useState(isLiked);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const mutation = useMutation<LikePostData, LikePostVariables>(
    gql`
      mutation LikePost($like: Boolean!, $postId: ID!) {
        likePost(like: $like, postId: $postId) {
          _id
          likeIds
          likeCount
        }
      }
    `,
    {
      refetchQueries: ["Post"],
    }
  );

  const [likePost] = mutation;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Update the state
  if (isLiked !== liked && !loading) {
    setLiked(isLiked);
  }

  const toggleLike = useCallback(async (): Promise<boolean> => {
    return setLike(!isLiked);
  }, [isLiked]);

  const setLike = useCallback(
    async (like: boolean): Promise<boolean> => {
      // Update state immediately for responsiveness
      setLiked(like);
      setLoading(true);

      let success = true;
      try {
        const result = await likePost({
          variables: {
            postId: id,
            like,
          },
        });

        if (!result.data?.likePost) {
          // Revert back to original state on error
          setLiked(isLiked);
          success = false;
        }
      } catch (err) {
        setLiked(isLiked);
        success = false;
        console.log("err", err);
      }

      // Allow time for graphql query for account to refetch and update
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Allow time for graphql query for account to refetch and update
      timeoutRef.current = setTimeout(() => {
        setLoading(false);
      }, 250);

      return success;
    },
    [isLiked]
  );

  return {
    isLiked: liked,
    toggleLike,
    like: setLike,
    likeCount: post?.likeCount ?? 0,
  };
}

import { useRef, useEffect, useState, useCallback } from "react";
import { gql, useMutation } from "@apollo/client";
import { useAccount } from "shared/graphql/query/account/useAccount";
import { UserProfile } from "backend/graphql/users.graphql";

type FollowUserVariables = {
  follow: boolean;
  userId: string;
};

type FollowUserData = {
  followUser: {
    account: Pick<UserProfile, "_id" | "followingIds" | "followingCount">;
    userAccount: Pick<UserProfile, "_id" | "followerIds" | "followingCount">;
  };
};

interface FollowUserReturn {
  isFollowing: boolean;
  toggleFollow: () => Promise<boolean>;
  follow: (follow: boolean) => Promise<boolean>;
}

/**
 * GraphQL mutation that resets a user's password
 *
 * @returns   GraphQL mutation.
 */
export function useFollowUser(id?: string): FollowUserReturn {
  if (!id) {
    return {
      isFollowing: false,
      toggleFollow: async () => {
        console.log("no user id provided to follow");
        return false;
      },
      follow: async (follow: boolean) => {
        console.log("no user id provided to follow", follow);
        return false;
      },
    };
  }

  const { data: accountData } = useAccount({ fetchPolicy: "cache-only" });
  const isFollowing = !!accountData?.account?.followingIds?.includes(id);
  const [following, setFollowing] = useState(isFollowing);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const mutation = useMutation<FollowUserData, FollowUserVariables>(
    gql`
      mutation FollowUser($follow: Boolean!, $userId: ID!) {
        followUser(follow: $follow, userId: $userId) {
          account {
            _id
            followingIds
            followingCount
          }
          userAccount {
            _id
            followerIds
            followingCount
          }
        }
      }
    `,
    {
      refetchQueries: ["Account", "UserProfile"],
    }
  );

  const [followUser] = mutation;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Update the state
  if (isFollowing != following && !loading) {
    setFollowing(isFollowing);
  }

  const toggleFollow = useCallback(async (): Promise<boolean> => {
    return setFollow(!isFollowing);
  }, [isFollowing]);

  const setFollow = useCallback(
    async (follow: boolean): Promise<boolean> => {
      // Update state immediately for responsiveness
      setFollowing(follow);
      setLoading(true);

      let success = true;
      try {
        const result = await followUser({
          variables: {
            userId: id,
            follow,
          },
        });

        if (!result.data?.followUser) {
          // Revert back to original state on error
          setFollowing(isFollowing);
          success = false;
        }
      } catch (err) {
        setFollowing(isFollowing);
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
    [isFollowing]
  );

  return {
    isFollowing: following,
    toggleFollow,
    follow: setFollow,
  };
}

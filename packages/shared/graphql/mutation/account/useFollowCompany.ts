import { useRef, useEffect, useState, useCallback } from "react";
import { gql, useMutation } from "@apollo/client";
import { useAccount } from "shared/graphql/query/account/useAccount";
import { UserProfile } from "backend/graphql/users.graphql";
import { Company } from "backend/graphql/companies.graphql";

type FollowCompanyVariables = {
  companyId: string;
  follow: boolean;
};

type FollowCompanyData = {
  followCompany: {
    account: Pick<UserProfile, "_id" | "companyFollowingIds">;
    company: Pick<Company, "_id" | "followerIds">;
  };
};

interface FollowCompanyReturn {
  isFollowing: boolean;
  toggleFollow: () => Promise<boolean>;
  follow: (follow: boolean) => Promise<boolean>;
}

/**
 * GraphQL mutation that resets a user's password
 *
 * @returns   GraphQL mutation.
 */
export function useFollowCompany(id?: string): FollowCompanyReturn {
  if (!id) {
    return {
      isFollowing: false,
      toggleFollow: async () => {
        console.log("no company id provided to follow");
        return false;
      },
      follow: async (follow: boolean) => {
        console.log("no company id provided to follow", follow);
        return false;
      },
    };
  }

  const { data: accountData } = useAccount({ fetchPolicy: "cache-only" });
  const isFollowing = !!accountData?.account?.companyFollowingIds?.includes(id);
  const [following, setFollowing] = useState(isFollowing);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const mutation = useMutation<FollowCompanyData, FollowCompanyVariables>(
    gql`
      mutation FollowCompany($follow: Boolean!, $companyId: ID!) {
        followCompany(follow: $follow, companyId: $companyId) {
          account {
            _id
            companyFollowingIds
          }
          company {
            _id
            followerIds
          }
        }
      }
    `,
    {
      refetchQueries: ["Account", "CompanyProfile"],
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
            companyId: id,
            follow,
          },
        });

        if (!result.data?.followCompany) {
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

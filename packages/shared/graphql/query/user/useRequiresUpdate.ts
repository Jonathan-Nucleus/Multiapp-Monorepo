import { gql, useQuery, QueryResult } from "@apollo/client";

type RequriesUpdateVariables = {
  version: string;
  build: string;
};

export type RequriesUpdateData = {
  requiresUpdate: boolean;
};

/**
 * GraphQL query that determines whether a given mobile app version requires
 * updating.
 *
 * @returns   GraphQL query.
 */
export function useRequiresUpdate(
  version: string,
  build: string
): QueryResult<RequriesUpdateData, RequriesUpdateVariables> {
  return useQuery<RequriesUpdateData, RequriesUpdateVariables>(
    gql`
      query RequiresUpdate($version: String!, $build: String!) {
        requiresUpdate(version: $version, build: $build)
      }
    `,
    {
      variables: {
        version,
        build,
      },
      fetchPolicy: "network-only",
    }
  );
}

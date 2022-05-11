import { ApolloServer, gql } from "apollo-server";
import { createTestApolloServer } from "../../../lib/server";
import { User } from "../../../schemas/user";
import { createUser } from "../../config/utils";
import { getIgniteDb } from "../../../db";

describe("Query - mentionUsers", () => {
  const query = gql`
    query MentionUsers($search: String) {
      mentionUsers(search: $search) {
        _id
        firstName
        lastName
      }
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo;
  let usersData: User.Mongo[];

  beforeAll(async () => {
    authUser = await createUser();
    usersData = (await Promise.all([
      await createUser(),
      await createUser(),
      await createUser(),
      await createUser(),
      await createUser(),
    ])) as User.Mongo[];
    server = createTestApolloServer(authUser);
  });

  it("succeeds to get mention users", async () => {
    const { users } = await getIgniteDb();

    const spy = jest
      .spyOn(users, "findByKeyword")
      .mockResolvedValueOnce(usersData);

    const res = await server.executeOperation({
      query,
    });

    expect(res.data?.mentionUsers).toHaveLength(usersData.length);

    spy.mockRestore();
  });

  it("succeeds to get mention users with search keyword", async () => {
    const { users } = await getIgniteDb();

    const spy = jest
      .spyOn(users, "findByKeyword")
      .mockResolvedValueOnce(usersData.slice(0, 3));

    const res = await server.executeOperation({
      query,
      variables: {
        search: "test",
      },
    });

    expect(res.data?.mentionUsers).toHaveLength(3);

    spy.mockRestore();
  });
});

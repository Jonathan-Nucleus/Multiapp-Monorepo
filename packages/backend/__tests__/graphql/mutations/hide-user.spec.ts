import { ApolloServer, gql } from "apollo-server";
import _ from "lodash";
import { createTestApolloServer } from "../../../lib/apollo/server";
import { ErrorCode } from "../../../lib/apollo/validate";
import { User } from "../../../schemas/user";
import { createUser, getErrorCode, getFieldError } from "../../config/utils";

import { getIgniteDb } from "../../../db";
import { toObjectId } from "../../../lib/mongo-helper";

describe("Mutations - hideUser", () => {
  const query = gql`
    mutation HideUser($hide: Boolean!, $userId: ID!) {
      hideUser(hide: $hide, userId: $userId)
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo;
  let user: User.Mongo;

  beforeAll(async () => {
    authUser = await createUser();
    user = await createUser();
    server = createTestApolloServer(authUser);
  });

  it("fails with invalid user id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        hide: true,
        userId: "test",
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "userId")).toBeDefined();
  });

  it("fails with wrong user id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        hide: true,
        userId: toObjectId().toString(),
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.NOT_FOUND);
  });

  it("succeeds to hide a user", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        hide: true,
        userId: user._id.toString(),
      },
    });

    expect(res.data?.hideUser).toBeTruthy();

    const { users } = await getIgniteDb();

    const newUser = (await users.find({ _id: authUser._id })) as User.Mongo;
    expect(_.map(newUser.hiddenUserIds, (item) => item.toString())).toContain(
      user._id.toString()
    );
  });

  it("succeeds to unhide a post", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        hide: false,
        userId: user._id.toString(),
      },
    });

    expect(res.data?.hideUser).toBeTruthy();

    const { users } = await getIgniteDb();

    const newUser = (await users.find({ _id: authUser._id })) as User.Mongo;
    expect(
      _.map(newUser.hiddenUserIds, (item) => item.toString())
    ).not.toContain(user._id.toString());
  });
});

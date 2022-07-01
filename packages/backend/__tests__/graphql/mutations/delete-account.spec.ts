import { ApolloServer, gql } from "apollo-server";
import { createTestApolloServer } from "../../../lib/apollo/server";
import { ErrorCode } from "../../../lib/apollo/validate";
import { User } from "../../../schemas/user";
import { createUser, DbCollection, getErrorCode } from "../../config/utils";
import { getIgniteDb } from "../../../db";
import { toObjectId } from "../../../lib/mongo-helper";

describe("Mutations - deleteAccount", () => {
  const query = gql`
    mutation DeleteAccount {
      deleteAccount
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo;

  beforeAll(async () => {
    authUser = await createUser();
    server = createTestApolloServer(authUser);
  });

  it("succeeds to delete an account", async () => {
    const { users, db } = await getIgniteDb();
    const oldUserCount = await db
      .collection(DbCollection.USERS)
      .countDocuments();

    const res = await server.executeOperation({
      query,
    });

    expect(res.data?.deleteAccount).toBeTruthy();

    const newUser = await users.find({ _id: toObjectId(authUser._id) });
    expect(newUser).toBeNull();

    const newUserCount = await db
      .collection(DbCollection.USERS)
      .countDocuments();
    expect(newUserCount).toBe(oldUserCount); // Soft delete
  });

  it("fails with deleted account", async () => {
    const res = await server.executeOperation({
      query,
    });

    expect(getErrorCode(res)).toBe(ErrorCode.UNAUTHENTICATED);
  });
});

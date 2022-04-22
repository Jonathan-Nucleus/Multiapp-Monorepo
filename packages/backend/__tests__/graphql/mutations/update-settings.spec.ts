import { ApolloServer, gql } from "apollo-server";
import { createTestApolloServer } from "../../../lib/server";
import { ErrorCode } from "../../../lib/validate";
import { User } from "../../../schemas/user";
import { createUser, getErrorCode } from "../../config/utils";
import { getIgniteDb } from "../../../db";
import { PostCategoryOptions } from "../../../schemas/post";

describe("Mutations - updateSettings", () => {
  const query = gql`
    mutation UpdateSettings($settings: SettingsInput!) {
      updateSettings(settings: $settings)
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo | null;

  beforeAll(async () => {
    authUser = await createUser();
    server = createTestApolloServer(authUser);
  });

  it("fails with invalid settings", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        settings: {
          interests: ["test-post-category"],
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("succeeds with correct settings", async () => {
    const { users } = await getIgniteDb();
    const oldUser = (await users.find({ _id: authUser?._id })) as User.Mongo;

    const postCategory = Object.keys(PostCategoryOptions)[0];

    const res = await server.executeOperation({
      query,
      variables: {
        settings: {
          interests: [postCategory],
        },
      },
    });

    expect(res.data).toHaveProperty("updateSettings");
    expect(res.data?.updateSettings).toBeTruthy();

    const newUser = (await users.find({ _id: authUser?._id })) as User.Mongo;

    expect(newUser.settings?.interests).toContain(
      PostCategoryOptions[postCategory].value
    );
    expect(newUser.updatedAt).not.toBe(oldUser.updatedAt);
  });
});

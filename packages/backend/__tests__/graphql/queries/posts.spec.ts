import { ApolloServer, gql } from "apollo-server";
import _ from "lodash";
import { createTestApolloServer } from "../../../lib/server";
import { ErrorCode } from "../../../lib/validate";
import { User } from "../../../schemas/user";
import { Post, PostCategoryOptions } from "../../../schemas/post";
import { createPost, createUser, getErrorCode } from "../../config/utils";

describe("Query - posts", () => {
  const query = gql`
    query Posts($categories: [PostCategory!]) {
      posts(categories: $categories) {
        _id
        body
        user {
          _id
          firstName
          lastName
        }
      }
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo | null;
  let user1: User.Mongo | null;
  let user2: User.Mongo | null;
  let posts: Post.Mongo[];

  beforeAll(async () => {
    authUser = await createUser("user", "client");
    user1 = await createUser("user", "accredited");
    user2 = await createUser("user");
    posts = (await Promise.all([
      await createPost(
        authUser?._id,
        [PostCategoryOptions.IDEAS.value],
        "everyone"
      ),
      await createPost(
        authUser?._id,
        [PostCategoryOptions.IDEAS.value],
        "accredited"
      ),
      await createPost(
        authUser?._id,
        [PostCategoryOptions.IDEAS.value],
        "client"
      ),
      await createPost(
        authUser?._id,
        [PostCategoryOptions.IDEAS.value],
        "purchaser"
      ),
      await createPost(
        user1?._id,
        [PostCategoryOptions.NEWS.value],
        "everyone"
      ),
      await createPost(
        user1?._id,
        [PostCategoryOptions.NEWS.value],
        "accredited"
      ),
      await createPost(
        user2?._id,
        [PostCategoryOptions.NEWS.value],
        "everyone"
      ),
      await createPost(
        user2?._id,
        [PostCategoryOptions.NEWS.value],
        "accredited"
      ),
    ])) as Post.Mongo[];

    server = createTestApolloServer(authUser);
  });

  it("fails with invalid category", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        categories: ["test"],
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("succeeds to get all posts", async () => {
    const res = await server.executeOperation({
      query,
    });

    expect(res.data?.posts).toHaveLength(7);
  });

  it("succeeds to get all NEWS posts", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        categories: ["NEWS"],
      },
    });

    expect(res.data?.posts).toHaveLength(4);
  });

  it("succeeds to get all IDEAS posts", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        categories: ["IDEAS"],
      },
    });

    expect(res.data?.posts).toHaveLength(3);
  });

  it("succeeds to get all POLITICS posts", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        categories: ["POLITICS"],
      },
    });

    expect(res.data?.posts).toHaveLength(0);
  });

  it("succeeds to get all NEWS, IDEAS and POLITICS posts", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        categories: ["NEWS", "IDEAS", "POLITICS"],
      },
    });

    expect(res.data?.posts).toHaveLength(7);
  });

  // TODO: hidden posts and hidden users
});

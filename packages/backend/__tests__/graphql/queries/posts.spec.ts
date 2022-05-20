import { ApolloServer, gql } from "apollo-server";
import { createTestApolloServer } from "../../../lib/server";
import { ErrorCode } from "../../../lib/validate";
import { User } from "../../../schemas/user";
import { Post, PostCategoryOptions } from "../../../schemas/post";
import {
  createPost,
  createUser,
  DbCollection,
  getErrorCode,
} from "../../config/utils";
import { getIgniteDb } from "../../../db";

describe("Query - posts", () => {
  const query = gql`
    query Posts($categories: [PostCategory!], $roleFilter: PostRoleFilter) {
      posts(categories: $categories, roleFilter: $roleFilter) {
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
  let authUser: User.Mongo;
  let user1: User.Mongo;
  let user2: User.Mongo;
  let user3: User.Mongo;

  beforeAll(async () => {
    authUser = await createUser("user", "client");
    user1 = await createUser("user", "purchaser");
    user2 = await createUser("user");
    user3 = await createUser("professional", "accredited");
    const postsIgnored = (await Promise.all([
      await createPost(
        authUser._id,
        false,
        [PostCategoryOptions.IDEAS.value],
        "everyone"
      ),
      await createPost(
        authUser._id,
        false,
        [PostCategoryOptions.IDEAS.value],
        "accredited"
      ),
      await createPost(
        authUser._id,
        false,
        [PostCategoryOptions.IDEAS.value],
        "client"
      ),
      await createPost(
        user1._id,
        false,
        [PostCategoryOptions.NEWS.value],
        "everyone"
      ),
      await createPost(
        user1._id,
        false,
        [PostCategoryOptions.CONSUMER.value],
        "accredited"
      ),
      await createPost(
        user1._id,
        false,
        [PostCategoryOptions.IDEAS.value],
        "purchaser"
      ),
      await createPost(
        user2._id,
        false,
        [PostCategoryOptions.NEWS.value],
        "everyone"
      ),
      await createPost(
        user2._id,
        false,
        [PostCategoryOptions.CONSUMER.value],
        "accredited"
      ),
      await createPost(
        user3._id,
        false,
        [PostCategoryOptions.NEWS.value],
        "everyone"
      ),
      await createPost(
        user3._id,
        false,
        [PostCategoryOptions.NEWS.value],
        "accredited"
      ),
      await createPost(
        user3._id,
        false,
        [PostCategoryOptions.CONSUMER.value],
        "accredited"
      ),
    ])) as Post.Mongo[];

    // Follow user 2
    const { db } = await getIgniteDb();
    await db
      .collection(DbCollection.USERS)
      .updateOne(
        { _id: authUser._id },
        { $addToSet: { followingIds: user2._id } }
      );

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

    expect(res.data?.posts).toHaveLength(10);
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

    console.log("posts", JSON.stringify(res));

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

  it("succeeds to get pros + follow posts", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        roleFilter: "PROFESSIONAL_FOLLOW",
      },
    });

    expect(res.data?.posts).toHaveLength(8);
  });

  it("succeeds to get NEWS pros + follow posts", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        categories: ["NEWS"],
        roleFilter: "PROFESSIONAL_FOLLOW",
      },
    });

    expect(res.data?.posts).toHaveLength(3);
  });

  it("succeeds to get professional's posts", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        roleFilter: "PROFESSIONAL_ONLY",
      },
    });

    expect(res.data?.posts).toHaveLength(6);
  });

  it("succeeds to get following's posts", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        roleFilter: "FOLLOW_ONLY",
      },
    });

    expect(res.data?.posts).toHaveLength(5);
  });

  // EVERYONE meeans returning all posts that they authenticated user has access
  // to see. In our test, authUser is a client, so they should be able to see
  // all posts that are not targeted toward purchasers, which is 10/11 of the
  // test posts
  it("succeeds to get everyone's posts", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        roleFilter: "EVERYONE",
      },
    });

    expect(res.data?.posts).toHaveLength(10);
  });

  // TODO: hidden posts and hidden users
});

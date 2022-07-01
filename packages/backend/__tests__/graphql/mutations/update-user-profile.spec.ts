import { ApolloServer, gql } from "apollo-server";
import { createTestApolloServer } from "../../../lib/apollo/server";
import { ErrorCode } from "../../../lib/apollo/validate";
import { User } from "../../../schemas/user";
import { createUser, getErrorCode } from "../../config/utils";
import { getIgniteDb } from "../../../db";

describe("Mutations - updateUserProfile", () => {
  const query = gql`
    mutation UpdateUserProfile($profile: UserProfileInput!) {
      updateUserProfile(profile: $profile) {
        _id
        firstName
        lastName
        position
        avatar
        background {
          url
          x
          y
          width
          height
          scale
        }
        tagline
        overview
        website
        linkedIn
        twitter
      }
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo;

  beforeAll(async () => {
    authUser = await createUser();
    server = createTestApolloServer(authUser);
  });

  const newProfileData = {
    firstName: "New first name",
    lastName: "New last name",
    position: "New position",
    avatar: "new_avatar.png",
    background: {
      url: "new_background.png",
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      scale: 2,
    },
    tagline: "new tagline",
    overview: "new overview",
    website: "http://newwebsite.com",
    linkedIn: "http://newwebsite.com",
    twitter: "http://newwebsite.com",
  };

  it("fails with invalid profile id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        profile: {
          _id: "not-a-real-id",
          ...newProfileData,
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("fails with another user's profile id", async () => {
    const anotherUser = await createUser();
    const res = await server.executeOperation({
      query,
      variables: {
        profile: {
          _id: anotherUser._id.toString(),
          ...newProfileData,
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_REQUEST);
  });

  it("fails with invalid website", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        profile: {
          _id: authUser._id.toString(),
          ...newProfileData,
          website: "not-a-real-website",
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("succeeds with correct profile data", async () => {
    const { users } = await getIgniteDb();
    const oldUser = (await users.find({ _id: authUser._id })) as User.Mongo;

    const profileData = {
      _id: authUser._id.toString(),
      ...newProfileData,
    };

    const res = await server.executeOperation({
      query,
      variables: {
        profile: profileData,
      },
    });

    expect(res.data).toHaveProperty("updateUserProfile");
    expect(JSON.stringify(res.data?.updateUserProfile)).toBe(
      JSON.stringify(profileData)
    );

    const newUser = (await users.find({ _id: authUser._id })) as User.Mongo;

    expect(JSON.stringify(newUser)).not.toBe(JSON.stringify(oldUser));
    expect(newUser.updatedAt).not.toBe(oldUser.updatedAt);
  });

  it("succeeds with partial profile data", async () => {
    const { users } = await getIgniteDb();
    const oldUser = (await users.find({ _id: authUser._id })) as User.Mongo;

    const res = await server.executeOperation({
      query,
      variables: {
        profile: {
          _id: oldUser._id.toString(),
          firstName: "Second first name",
        },
      },
    });

    expect(res.data).toHaveProperty("updateUserProfile");
    expect(res.data?.updateUserProfile?.firstName).not.toBe(oldUser.firstName);
    expect(res.data?.updateUserProfile?.lastName).toBe(oldUser.lastName);
    expect(res.data?.updateUserProfile?.position).toBe(oldUser.position);
    expect(res.data?.updateUserProfile?.avatar).toBe(oldUser.avatar);
    expect(JSON.stringify(res.data?.updateUserProfile?.background)).toBe(
      JSON.stringify(oldUser.background)
    );
    expect(res.data?.updateUserProfile?.tagline).toBe(oldUser.tagline);
    expect(res.data?.updateUserProfile?.overview).toBe(oldUser.overview);
    expect(res.data?.updateUserProfile?.website).toBe(oldUser.website);
    expect(res.data?.updateUserProfile?.linkedIn).toBe(oldUser.linkedIn);
    expect(res.data?.updateUserProfile?.twitter).toBe(oldUser.twitter);

    const newUser = (await users.find({ _id: authUser._id })) as User.Mongo;

    expect(JSON.stringify(newUser)).not.toBe(JSON.stringify(oldUser));
    expect(newUser.updatedAt).not.toBe(oldUser.updatedAt);
  });
});

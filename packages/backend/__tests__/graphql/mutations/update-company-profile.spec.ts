import { ApolloServer, gql } from "apollo-server";
import { createTestApolloServer } from "../../../lib/server";
import { ErrorCode } from "../../../lib/validate";
import { User } from "../../../schemas/user";
import { Company } from "../../../schemas/company";
import { createUser, createCompany, getErrorCode } from "../../config/utils";
import { getIgniteDb } from "../../../db";

describe("Mutations - updateCompanyProfile", () => {
  const query = gql`
    mutation UpdateCompanyProfile($profile: CompanyProfileInput!) {
      updateCompanyProfile(profile: $profile) {
        _id
        name
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
  let authCompany: Company.Mongo;

  beforeAll(async () => {
    authUser = await createUser();
    authCompany = await createCompany(authUser._id);
    server = createTestApolloServer(authUser);
  });

  const newProfileData = {
    name: "New company name",
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

  it("fails when user not member of company", async () => {
    const anotherUser = (await createUser()) as User.Mongo;
    const anotherCompany = await createCompany(anotherUser._id);
    const res = await server.executeOperation({
      query,
      variables: {
        profile: {
          _id: anotherCompany._id.toString(),
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
          _id: authCompany._id.toString(),
          ...newProfileData,
          website: "not-a-real-website",
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("succeeds with correct profile data", async () => {
    const { companies } = await getIgniteDb();
    const oldCompany = (await companies.find(authCompany._id)) as Company.Mongo;

    const profileData = {
      _id: authCompany._id.toString(),
      ...newProfileData,
    };

    const res = await server.executeOperation({
      query,
      variables: {
        profile: profileData,
      },
    });

    expect(res.data).toHaveProperty("updateCompanyProfile");
    expect(JSON.stringify(res.data?.updateCompanyProfile)).toBe(
      JSON.stringify(profileData)
    );

    const newCompany = (await companies.find(authCompany._id)) as Company.Mongo;

    expect(JSON.stringify(newCompany)).not.toBe(JSON.stringify(oldCompany));
    expect(newCompany.updatedAt).not.toBe(oldCompany.updatedAt);
  });

  it("succeeds with partial profile data", async () => {
    const { companies } = await getIgniteDb();
    const oldCompany = (await companies.find(authCompany._id)) as Company.Mongo;

    const res = await server.executeOperation({
      query,
      variables: {
        profile: {
          _id: oldCompany._id.toString(),
          name: "Second company name",
        },
      },
    });

    expect(res.data).toHaveProperty("updateCompanyProfile");
    expect(res.data?.updateCompanyProfile?.name).not.toBe(oldCompany.name);
    expect(res.data?.updateCompanyProfile?.avatar).toBe(oldCompany.avatar);
    expect(JSON.stringify(res.data?.updateCompanyProfile?.background)).toBe(
      JSON.stringify(oldCompany.background)
    );
    expect(res.data?.updateCompanyProfile?.tagline).toBe(oldCompany.tagline);
    expect(res.data?.updateCompanyProfile?.overview).toBe(oldCompany.overview);
    expect(res.data?.updateCompanyProfile?.website).toBe(oldCompany.website);
    expect(res.data?.updateCompanyProfile?.linkedIn).toBe(oldCompany.linkedIn);
    expect(res.data?.updateCompanyProfile?.twitter).toBe(oldCompany.twitter);

    const newCompany = (await companies.find(authCompany._id)) as Company.Mongo;

    expect(JSON.stringify(newCompany)).not.toBe(JSON.stringify(oldCompany));
    expect(newCompany.updatedAt).not.toBe(oldCompany.updatedAt);
  });
});

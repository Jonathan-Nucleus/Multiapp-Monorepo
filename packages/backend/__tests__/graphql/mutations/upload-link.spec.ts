import faker from "@faker-js/faker";
import { ApolloServer, gql } from "apollo-server";
import * as S3RequestPresigner from "@aws-sdk/s3-request-presigner";
import { createTestApolloServer } from "../../../lib/server";
import { ErrorCode } from "../../../lib/validate";
import { User } from "../../../schemas/user";
import { createUser, getErrorCode, getFieldError } from "../../config/utils";

jest.mock("@aws-sdk/client-s3");
jest.mock("@aws-sdk/s3-request-presigner");

describe("Mutations - uploadLink", () => {
  const query = gql`
    mutation UploadLink($localFilename: String!, $type: MediaType!) {
      uploadLink(localFilename: $localFilename, type: $type) {
        remoteName
        uploadUrl
      }
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo;
  const fileExt = faker.system.commonFileExt();
  const fileData = {
    localFilename: faker.system.commonFileName(fileExt),
    type: "AVATAR",
  };

  beforeAll(async () => {
    authUser = await createUser();
    server = createTestApolloServer(authUser);
  });

  it("fails with empty filename", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        ...fileData,
        localFilename: "",
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "localFilename")).toBeDefined();
  });

  it("fails with empty type", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        ...fileData,
        type: "",
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("succeeds to generate the url", async () => {
    const testUrl = faker.internet.url();

    const spy = jest
      .spyOn(S3RequestPresigner, "getSignedUrl")
      .mockResolvedValueOnce(testUrl);

    const res = await server.executeOperation({
      query,
      variables: {
        ...fileData,
      },
    });

    expect(res.data?.uploadLink.uploadUrl).toBe(testUrl);
    expect(res.data?.uploadLink.remoteName.endsWith(fileExt)).toBeTruthy();

    spy.mockRestore();
  });
});

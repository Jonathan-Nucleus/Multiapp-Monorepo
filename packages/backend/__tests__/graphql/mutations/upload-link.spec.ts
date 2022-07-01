import faker from "@faker-js/faker";
import { ApolloServer, gql } from "apollo-server";
import { S3RequestPresigner } from "@aws-sdk/s3-request-presigner";
import { formatUrl } from "@aws-sdk/util-format-url";
import { createTestApolloServer } from "../../../lib/apollo/server";
import { ErrorCode } from "../../../lib/apollo/validate";
import { User } from "../../../schemas/user";
import { createUser, getErrorCode, getFieldError } from "../../config/utils";
import { toObjectId } from "../../../lib/mongo-helper";

jest.mock("@aws-sdk/client-s3");
jest.mock("@aws-sdk/s3-request-presigner");

describe("Mutations - uploadLink", () => {
  const query = gql`
    mutation UploadLink($localFilename: String!, $type: MediaType!, $id: ID!) {
      uploadLink(localFilename: $localFilename, type: $type, id: $id) {
        remoteName
        uploadUrl
      }
    }
  `;

  const mockedPresigner = {
    method: "PUT",
    hostname: "m7e9rrgs5fz76.mrap.accesspoint.s3-global.amazonaws.com",
    query: {
      "X-Amz-Content-Sha256": "UNSIGNED-PAYLOAD",
      "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
      "X-Amz-Credential":
        "AKIAVJRKWAWIOOYR3CIP/20220612/us-east-1/s3/aws4_request",
      "X-Amz-Date": "20220612T122252Z",
      "X-Amz-Expires": "60",
      "X-Amz-SignedHeaders": "host",
      "X-Amz-Signature":
        "c5e037fc30feb5c4d7b2c154ad8ca7383418e28e42da5aebf5b1ca3bf3ea9965",
    },
    headers: { host: "m7e9rrgs5fz76.mrap.accesspoint.s3-global.amazonaws.com" },
    protocol: "https:",
    path: "/funds/62913f94de95d16a455d1664/8ac0748b-a074-4193-9731-6509d7cf738d.pdf",
  };

  let server: ApolloServer;
  let authUser: User.Mongo;
  const fileExt = faker.system.commonFileExt();
  const fileData = {
    localFilename: faker.system.commonFileName(fileExt),
    type: "AVATAR",
    id: toObjectId().toString(),
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
    const testUrl = formatUrl(mockedPresigner);
    const spy = jest
      .spyOn(S3RequestPresigner.prototype, "presign")
      .mockResolvedValueOnce(mockedPresigner);

    const res = await server.executeOperation({
      query,
      variables: {
        ...fileData,
      },
    });

    console.log("res", res);

    expect(res.data?.uploadLink.uploadUrl).toBe(testUrl);
    expect(res.data?.uploadLink.remoteName.endsWith(fileExt)).toBeTruthy();

    spy.mockRestore();
  });
});

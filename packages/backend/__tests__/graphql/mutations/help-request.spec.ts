import faker from "@faker-js/faker";
import { ApolloServer, gql } from "apollo-server-express";
import { createTestApolloServer } from "../../../lib/apollo/server";
import { ErrorCode } from "../../../lib/apollo/validate";
import { User } from "../../../schemas/user";
import {
  createFund,
  createUser,
  getErrorCode,
  getFieldError,
} from "../../config/utils";
import { getIgniteDb } from "../../../db";
import { toObjectId } from "../../../lib/mongo-helper";
import { Fund } from "../../../schemas/fund";
import { PrometheusMailer } from "../../../email";
import { HelpRequest } from "../../../schemas/help-request";

describe("Mutations - helpRequest", () => {
  const query = gql`
    mutation HelpRequest($request: HelpRequestInput!) {
      helpRequest(request: $request)
    }
  `;

  let server: ApolloServer;
  let authUser: User.Mongo;
  let fund1: Fund.Mongo;

  const emailRequest = {
    type: "EMAIL",
    email: faker.internet.email(),
    fundId: toObjectId().toString(),
    message: faker.lorem.sentence(),
  };

  const phoneRequest = {
    type: "PHONE",
    phone: faker.phone.phoneNumber(),
    fundId: toObjectId().toString(),
    preferredTimeOfDay: "MORNING",
    message: faker.lorem.sentence(),
  };

  beforeAll(async () => {
    authUser = await createUser();
    fund1 = await createFund();
    server = createTestApolloServer(authUser);
  });

  it("fails with empty email", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        request: {
          ...emailRequest,
          email: "",
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "request.email")).toBeDefined();
  });

  it("fails with invalid email", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        request: {
          ...emailRequest,
          email: "test",
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "request.email")).toBeDefined();
  });

  it("fails without fund id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        request: {
          ...emailRequest,
          fundId: "",
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "request.fundId")).toBeDefined();
  });

  it("fails with invalid fund id", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        request: {
          ...emailRequest,
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.NOT_FOUND);
  });

  it("fails with empty phone", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        request: {
          ...phoneRequest,
          phone: "",
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
    expect(getFieldError(res, "request.phone")).toBeDefined();
  });

  it("fails without preferred time of day", async () => {
    const res = await server.executeOperation({
      query,
      variables: {
        request: {
          ...phoneRequest,
          preferredTimeOfDay: "",
        },
      },
    });

    expect(getErrorCode(res)).toBe(ErrorCode.BAD_USER_INPUT);
  });

  it("succeeds to send the request with email mode", async () => {
    const spy = jest
      .spyOn(PrometheusMailer, "sendHelpRequest")
      .mockResolvedValueOnce(true);

    const { db } = await getIgniteDb();

    const oldCount = await db.collection("help-requests").countDocuments();

    const res = await server.executeOperation({
      query,
      variables: {
        request: {
          ...emailRequest,
          fundId: fund1._id.toString(),
        },
      },
    });

    expect(res.data).toHaveProperty("helpRequest");
    expect(res.data?.helpRequest).toBeTruthy();

    const newCount = await db.collection("help-requests").countDocuments();
    expect(newCount).toBe(oldCount + 1);

    const newHelpRequest = (await db
      .collection("help-requests")
      .findOne({}, { sort: { _id: -1 } })) as HelpRequest.Mongo;
    expect(newHelpRequest.type).toBe("email");
    expect(newHelpRequest.email).toBe(emailRequest.email);
    expect(newHelpRequest.fundId.toString()).toBe(fund1._id.toString());
    expect(newHelpRequest.message).toBe(emailRequest.message);

    spy.mockRestore();
  });

  it("succeeds to send the request with phone mode", async () => {
    const spy = jest
      .spyOn(PrometheusMailer, "sendHelpRequest")
      .mockResolvedValueOnce(true);

    const { db } = await getIgniteDb();

    const oldCount = await db.collection("help-requests").countDocuments();

    const res = await server.executeOperation({
      query,
      variables: {
        request: {
          ...phoneRequest,
          fundId: fund1._id.toString(),
        },
      },
    });

    expect(res.data).toHaveProperty("helpRequest");
    expect(res.data?.helpRequest).toBeTruthy();

    const newCount = await db.collection("help-requests").countDocuments();
    expect(newCount).toBe(oldCount + 1);

    const newHelpRequest = (await db
      .collection("help-requests")
      .findOne({}, { sort: { _id: -1 } })) as HelpRequest.Mongo;
    expect(newHelpRequest.type).toBe("phone");
    expect(newHelpRequest.phone).toBe(phoneRequest.phone);
    expect(newHelpRequest.fundId.toString()).toBe(fund1._id.toString());
    expect(newHelpRequest.message).toBe(phoneRequest.message);
    expect(newHelpRequest.preferredTimeOfDay).toBe("morning");

    spy.mockRestore();
  });
});

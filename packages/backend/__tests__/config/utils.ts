import faker from "@faker-js/faker";
import { GraphQLResponse } from "apollo-server-types";
import crypto, { randomInt } from "crypto";
import { getIgniteDb } from "../../db";
import {
  DeserializedUser,
  generateSalt,
  hashPassword,
} from "../../db/collections/users";
import { getAccessToken } from "../../lib/tokens";
import { Accreditation, User, UserRole } from "../../schemas/user";
import { Audience, Post, PostCategory } from "../../schemas/post";
import { randomArray } from "../../db/seed/helpers";
import {
  audienceValues,
  categoryValues,
  MAX_CATEGORIES_PER_POST,
} from "../../db/seed/posts";
import { MongoId, toObjectId } from "../../lib/mongo-helper";
import { Comment } from "../../schemas/comment";
import { Company } from "../../schemas/company";
import { Fund } from "../../schemas/fund";

export const getFieldError = (response: GraphQLResponse, field: string) =>
  (response.errors?.[0].extensions?.errors as any)[field];

export const getErrorCode = (response: GraphQLResponse) =>
  response.errors?.[0].extensions?.code;

export enum DbCollection {
  USERS = "users",
  POSTS = "posts",
  COMMENTS = "comments",
  COMPANIES = "companies",
  FUNDS = "funds",
}

export const createUser = async (
  role: UserRole = "user",
  accreditation: Accreditation = "none",
  featured: boolean = false
): Promise<User.Mongo | null> => {
  const { db } = await getIgniteDb();
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const salt = generateSalt();

  const user: User.Mongo = {
    _id: toObjectId(),
    firstName,
    lastName,
    email: faker.internet.email(firstName, lastName),
    salt,
    password: hashPassword("test-pass", salt),
    role,
    accreditation,
    website: faker.internet.url(),
    avatar: `${faker.datatype.uuid()}.png`,
    position: faker.name.jobTitle(),
    emailToken: faker.datatype.uuid(),
    featured,
  };

  try {
    await db.collection(DbCollection.USERS).insertOne(user);

    return user;
  } catch (err) {
    console.log(`Error: `, err);
  }

  return null;
};

export const createStub = async (): Promise<User.Stub | null> => {
  const { db } = await getIgniteDb();

  const user = {
    _id: toObjectId(),
    email: faker.internet.email(),
    role: "stub",
    emailToken: crypto.randomBytes(3).toString("hex").toUpperCase(),
  } as const;

  try {
    await db.collection(DbCollection.USERS).insertOne(user);

    return user;
  } catch (err) {
    console.log(`Error: `, err);
  }

  return null;
};

export const createPost = async (
  userId?: MongoId,
  categories?: PostCategory[],
  audience?: Audience
): Promise<Post.Mongo | null> => {
  const { db } = await getIgniteDb();

  const post: Post.Mongo = {
    _id: toObjectId(),
    visible: true,
    body: faker.lorem.sentence(),
    userId: toObjectId(userId),
    audience:
      audience || audienceValues[randomInt(0, audienceValues.length - 1)],
    featured: faker.datatype.boolean(),
    categories:
      categories ||
      Array.from(
        new Set(
          randomArray(
            0,
            categoryValues.length - 1,
            randomInt(0, MAX_CATEGORIES_PER_POST)
          )
        )
      ).map((index) => categoryValues[index]),
  };

  try {
    await db.collection(DbCollection.POSTS).insertOne(post);
    await db
      .collection(DbCollection.USERS)
      .updateOne(
        { _id: toObjectId(userId) },
        { $addToSet: { postIds: post._id } }
      );

    return post;
  } catch (err) {
    console.log(`Error: `, err);
  }

  return null;
};

export const createComment = async (
  userId?: MongoId,
  postId?: MongoId
): Promise<Comment.Mongo | null> => {
  const { db } = await getIgniteDb();

  const comment: Comment.Mongo = {
    _id: toObjectId(),
    userId: toObjectId(userId),
    body: faker.lorem.sentence(),
    postId: toObjectId(postId),
  };

  try {
    await db.collection(DbCollection.COMMENTS).insertOne(comment);
    await db.collection(DbCollection.POSTS).updateOne(
      { _id: toObjectId(postId) },
      {
        $addToSet: { commentIds: comment._id },
        $set: { updatedAt: new Date() },
      }
    );

    return comment;
  } catch (err) {
    console.log(`Error: `, err);
  }

  return null;
};

export const createCompany = async (
  userId?: MongoId
): Promise<Company.Mongo | null> => {
  const { db } = await getIgniteDb();

  const company: Company.Mongo = {
    _id: toObjectId(),
    name: faker.company.companyName(),
    memberIds: [toObjectId(userId)],
  };

  try {
    await db.collection(DbCollection.COMPANIES).insertOne(company);
    await db
      .collection(DbCollection.USERS)
      .updateOne(
        { _id: toObjectId(userId) },
        { $addToSet: { companyIds: company._id } }
      );

    return company;
  } catch (err) {
    console.log(`Error: `, err);
  }

  return null;
};

export const createFund = async (
  userId?: MongoId,
  companyId?: MongoId,
  level: Accreditation = "none"
): Promise<Fund.Mongo | null> => {
  const { db } = await getIgniteDb();

  const fund: Fund.Mongo = {
    _id: toObjectId(),
    name: `${faker.commerce.product()} Fund`,
    level,
    background: {
      url: "aefca1e5-7378-45bf-81cf-89f7f88366f5.png",
      width: 1000,
      height: 521,
      x: 0,
      y: 0,
      scale: 1,
    },
    managerId: toObjectId(userId),
    companyId: toObjectId(companyId),
    status: "open",
    highlights: [faker.lorem.sentence()],
    overview: faker.lorem.paragraph(8),
    teamIds: [toObjectId(userId)],
    tags: [faker.lorem.word()],
  };

  try {
    await db.collection(DbCollection.FUNDS).insertOne(fund);
    if (companyId) {
      await db
        .collection(DbCollection.COMPANIES)
        .updateOne(
          { _id: toObjectId(companyId) },
          { $addToSet: { fundIds: fund._id } }
        );
    }
    if (userId) {
      await db
        .collection(DbCollection.USERS)
        .updateOne(
          { _id: toObjectId(userId) },
          { $addToSet: { managedFundsIds: toObjectId(userId) } }
        );
    }

    return fund;
  } catch (err) {
    console.log(`Error: `, err);
  }

  return null;
};

export const deserializeUser = (user: User.Mongo): DeserializedUser => {
  const { _id, role, accreditation } = user;

  return {
    _id: _id.toString(),
    role,
    acc: accreditation,
  };
};

export const generateAuthToken = (user?: User.Mongo | null): string => {
  if (!user) {
    throw new Error("Invalid user.");
  }

  return getAccessToken(deserializeUser(user));
};

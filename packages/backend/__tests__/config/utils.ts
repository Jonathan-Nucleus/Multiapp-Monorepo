import faker from "@faker-js/faker";
import { GraphQLResponse } from "apollo-server-types";
import crypto, { randomInt } from "crypto";
import { getIgniteDb } from "../../db";
import {
  DeserializedUser,
  generateSalt,
  hashPassword,
  DEFAULT_USER_OPTIONS,
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
import { InternalServerError } from "../../lib/validate";
import { NotificationType, Notification } from "../../schemas/notification";

export const getFieldError = (
  response: GraphQLResponse,
  field: string
): unknown => (response.errors?.[0].extensions?.errors as never)[field];

export const getErrorCode = (response: GraphQLResponse): string =>
  response.errors?.[0].extensions?.code as string;

export enum DbCollection {
  USERS = "users",
  POSTS = "posts",
  COMMENTS = "comments",
  COMPANIES = "companies",
  FUNDS = "funds",
  NOTIFICATIONS = "notifications",
}

export const createUser = async (
  role: UserRole = "user",
  accreditation: Accreditation = "none",
  featured = false
): Promise<User.Mongo> => {
  const { db } = await getIgniteDb();
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const salt = generateSalt();

  const user: User.Mongo = {
    ...DEFAULT_USER_OPTIONS,
    _id: toObjectId(),
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    email: faker.internet.email(firstName, lastName).toLowerCase(),
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
    throw new InternalServerError("Error creating user");
  }
};

export const createStub = async (): Promise<User.Stub> => {
  const { db } = await getIgniteDb();

  const user = {
    _id: toObjectId(),
    email: faker.internet.email().toLowerCase(),
    role: "stub",
    emailToken: crypto.randomBytes(3).toString("hex").toUpperCase(),
  } as const;

  try {
    await db.collection(DbCollection.USERS).insertOne(user);

    return user;
  } catch (err) {
    throw new InternalServerError("Error creating stub user");
  }
};

export const createPost = async (
  userId?: MongoId,
  isCompany = false,
  categories?: PostCategory[],
  audience?: Audience
): Promise<Post.Mongo> => {
  const { db } = await getIgniteDb();

  const post: Post.Mongo = {
    _id: toObjectId(),
    visible: true,
    isCompany,
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
    throw new InternalServerError("Error creating post");
  }
};

export const createComment = async (
  userId?: MongoId,
  postId?: MongoId
): Promise<Comment.Mongo> => {
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
    throw new InternalServerError("Error creating comment");
  }
};

export const createCompany = async (
  userId?: MongoId
): Promise<Company.Mongo> => {
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
    throw new InternalServerError("Error creating company");
  }
};

export const createFund = async (
  userId?: MongoId,
  companyId?: MongoId,
  level: Accreditation = "none"
): Promise<Fund.Mongo> => {
  const { db } = await getIgniteDb();

  const fund: Fund.Mongo = {
    _id: toObjectId(),
    name: `${faker.commerce.product()} Fund`,
    level,
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
    throw new InternalServerError("Error creating fund");
  }
};

export const createNotification = async (
  fromUserId: MongoId,
  toUserId: MongoId,
  isNew = true,
  type: NotificationType = "followed-by-user"
): Promise<Notification.Mongo> => {
  const { db } = await getIgniteDb();

  const notification: Notification.Mongo = {
    _id: toObjectId(),
    userId: toObjectId(toUserId),
    title: faker.lorem.sentence(),
    body: faker.lorem.sentence(),
    type,
    data: {
      userId: toObjectId(fromUserId),
    },
    isNew,
  };

  try {
    await db.collection(DbCollection.NOTIFICATIONS).insertOne(notification);
    if (toUserId && isNew) {
      await db
        .collection(DbCollection.USERS)
        .updateOne(
          { _id: toObjectId(toUserId) },
          { $inc: { notificationBadge: 1 } }
        );
    }

    return notification;
  } catch (err) {
    throw new InternalServerError("Error creating notification");
  }
};

export const deserializeUser = (user: User.Mongo): DeserializedUser => {
  const { _id, role, accreditation } = user;

  return {
    _id: _id.toString(),
    role,
    acc: accreditation,
  };
};

export const generateAuthToken = (user?: User.Mongo): string => {
  if (!user) {
    throw new Error("Invalid user.");
  }

  return getAccessToken(deserializeUser(user));
};

/**
 * Users collection that serves as the model layer to manipulate and store user
 * data in a MongoDB database. It based on the NextAuth Users model in order
 * to provide integration with the NextAuth user authentication module.
 *
 * NextAuth handles user account creation and validation. This implementation
 * provides users with the option to create an account using their email
 * address and sends a one-time sign in token for authentication.
 */

import { Collection, ObjectId } from "mongodb";
import {
  MongoId,
  toObjectId,
  toObjectIds,
  GraphQLEntity,
} from "backend/lib/mongo-helper";
import crypto from "crypto";
import type { User } from "backend/schemas/user";

// Read salt length from .env file and parse to a number. This represents
// the number of bytes used for the salt. A default of 32 bytes (256 bits)
// as a default.
const SALT_LENGTH = parseInt(process.env.SALT_LEN ?? "32");

const hashPassword = (password: string, salt: string): string => {
  return crypto.scryptSync(password, salt, 64).toString("hex");
};

type FindOptions = {
  _id?: string | ObjectId;
  email?: string;
};

export type DeserializedUser = GraphQLEntity<
  Required<Pick<User.Mongo, "_id" | "email" | "role">>
>;

/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
const createUsersCollection = (usersCollection: Collection<User.Mongo>) => {
  return {
    // If a user is not found find() should return null (with no error).
    find: async ({ _id, email }: FindOptions): Promise<User.Mongo | null> => {
      let query = {};

      // Find needs to support looking up a user by ID and Email
      if (_id) {
        query = { _id: toObjectId(_id) };
      } else if (email) {
        query = { email: email };
      }

      return usersCollection.findOne(query);
    },

    /**
     * Provides a list of all users stored within the DB.
     *
     * @param ids An optional array of specific IDs to filter by.
     *
     * @returns {User[]}  An array of User objects.
     */
    findAll: async (
      ids: MongoId[] | undefined = undefined
    ): Promise<User.Mongo[]> => {
      const query =
        ids !== undefined ? { _id: { $in: ids ? toObjectIds(ids) : ids } } : {};
      return usersCollection.find(query).toArray();
    },
  };
};

export default createUsersCollection;

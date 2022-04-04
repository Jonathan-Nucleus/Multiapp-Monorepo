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
import { v4 as uuid } from "uuid";
import {
  User,
  UserRoleOptions,
  AccreditationOptions,
  isUser,
} from "backend/schemas/user";

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

export type DeserializedUser = {
  _id: string;
  role: User.Mongo["role"];
  acc: User.Mongo["accreditation"];
};

/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
const createUsersCollection = (
  usersCollection: Collection<User.Mongo | User.Stub>
) => {
  const collection = {
    // If a user is not found find() should return null (with no error).
    find: async ({
      _id,
      email,
    }: FindOptions): Promise<User.Mongo | User.Stub | null> => {
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
     * Provides a list of all users stored within the DB. Note that this does
     * not include stub accounts for users with pending invitations.
     *
     * @param ids An optional array of specific IDs to filter by.
     *
     * @returns {User[]}  An array of User objects.
     */
    findAll: async (
      ids: MongoId[] | undefined = undefined
    ): Promise<User.Mongo[]> => {
      const query = {
        firstName: { $exists: true },
        ...(ids !== undefined
          ? { _id: { $in: ids ? toObjectIds(ids) : ids } }
          : {}),
      };

      return (await usersCollection.find(query).toArray()) as User.Mongo[];
    },

    /**
     * Authenticates a user with the provided credentials.
     *
     * @param email     The email address of the account.
     * @param password  The password for the account.
     *
     * @returns   The user record if the credentials are successfully
     *            authenticated, and null otherwise.
     */
    authenticate: async (
      email: string,
      password: string
    ): Promise<User.Mongo | null> => {
      const user = await usersCollection.findOne({ email });
      if (!user || !isUser(user) || !user.salt) return null;

      // Check credentials - i.e., compare bcrypt password hashes
      if (hashPassword(password, user.salt) != user.password) return null;
      return user;
    },

    /**
     * Registers a new user.
     *
     * @param user  User data for new account.
     *
     * @returns   Record id for the new account if registration was successful
     *            and null otherwise.
     */
    register: async (user: User.Input): Promise<ObjectId | null> => {
      const { email, firstName, lastName, password, inviteCode } = user;

      // Ensure user already already exists as a stub
      const userData = await collection.find({ email });
      if (!userData || isUser(userData) || userData.emailToken !== inviteCode)
        return null;

      const salt = crypto.randomBytes(SALT_LENGTH).toString("hex");
      const hash = hashPassword(password, salt);

      const newUser = {
        ...userData,
        inviteCode: "",
        password: hash,
        salt,
        firstName,
        lastName,
        role: UserRoleOptions.USER,
        accreditation: AccreditationOptions.NONE,
      };

      try {
        await usersCollection.replaceOne({ _id: userData._id }, newUser);
        return newUser._id;
      } catch (err) {
        console.log(`Error encountered while registering user: ${err}`);
        return null;
      }
    },

    /**
     * Sends an invitation to a new user to join the platform.
     *
     * @param email   The email address for the new user.
     *
     * @returns   True if the invitation was successfully sent and false
     *            otherwise.
     */
    requestInvite: async (email: string): Promise<User.Stub | null> => {
      const stubUser = {
        _id: new ObjectId(),
        email,
        role: "stub",
        emailToken: uuid(),
      } as const;

      try {
        // Check whether user is already registered or invited
        const user = await usersCollection.findOne({ email });
        if (user) return null;

        await usersCollection.insertOne(stubUser);
      } catch (err) {
        console.log(`Error inviting user ${email}: ${err}`);
        return null;
      }

      // TODO: Send email to invited user

      return stubUser;
    },

    /**
     * Sends an invitation from an existing user to a new user.
     *
     * @param userId  The ID the existing user sending the invitation.
     * @param email   The email address for the new user.
     *
     * @returns   True if the invitation was successfully sent and false
     *            otherwise.
     */
    invite: async (userId: MongoId, email: string): Promise<boolean> => {
      try {
        const stubUser = await collection.requestInvite(email);
        if (!stubUser) return false;

        await usersCollection.updateOne(
          { _id: toObjectId(userId) },
          { $addToSet: { invitees: stubUser._id } }
        );
      } catch (err) {
        console.log(`Error inviting user ${email}: ${err}`);
        return false;
      }

      return true;
    },

    /**
     * Converts a user ID into a compact normalized user object that contains
     * information useful for packaging into a JWT.
     *
     * @param userId  The ID of the user record to deserialize.
     *
     * @returns A deserialized object contains the _id, user role, and
     *          accreditation status for the user.
     */
    deserialize: async (userId: MongoId): Promise<DeserializedUser | null> => {
      const user = await usersCollection.findOne({ _id: toObjectId(userId) });
      if (!user || !isUser(user)) return null;

      const { _id, role, accreditation } = user;
      return {
        _id: _id.toString(),
        role,
        acc: accreditation,
      };
    },
  };

  return collection;
};

export default createUsersCollection;

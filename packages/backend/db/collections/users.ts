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
} from "../../lib/mongo-helper";
import crypto from "crypto";
import axios from "axios";
import fetch from "node-fetch";
import { v4 as uuid } from "uuid";
import { OAuth2Client } from "google-auth-library";
import {
  User,
  UserRoleOptions,
  AccreditationOptions,
  Settings,
  ReportedPost,
  isUser,
} from "../../schemas/user";

import "dotenv/config";

// Read salt length from .env file and parse to a number. This represents
// the number of bytes used for the salt. A default of 32 bytes (256 bits)
// as a default.
export const SALT_LENGTH = parseInt(process.env.SALT_LEN ?? "32");
export const generateSalt = (): string => {
  return crypto.randomBytes(SALT_LENGTH).toString("hex");
};

export const hashPassword = (password: string, salt: string): string => {
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
     * Registers a new user authenticated using an external OAuth provider.
     *
     * @param user  User data for new account.
     *
     * @returns   Record id for the new account if registration was successful
     *            and null otherwise.
     */
    authenticateOAuth: async (
      user: User.OAuthInput
    ): Promise<User.Mongo | null> => {
      const { email, firstName, lastName, provider, tokenId } = user;

      // Verify access tokens before fetching associated user record
      if (provider === "google") {
        // Verify google token
        const client = new OAuth2Client(process.env.GOOGLE_ID as string);
        try {
          const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOLGE_ID as string,
          });
          const payload = ticket.getPayload();
          console.log("payload", payload);
        } catch (err) {
          console.log(`Invalid google access token: ${tokenId}`);
          return null;
        }
      } else if (provider === "linkedin") {
        // Verify LinkedIn token
        try {
          await axios.get(
            `https://api.linkedin.com/v2/me?oauth2_access_token=${tokenId}`
          );
        } catch {
          console.log(`Invalid linkedin access token: ${tokenId}`);
          return null;
        }
      } else {
        return null; // Unsupported provider
      }

      const userData = await collection.find({ email });
      if (userData && isUser(userData)) {
        // Check to make sure that the provider that the account was created
        // with matches the provider from which this OAuth token was provided.
        if (userData?.authProvider !== provider) {
          console.log(`Linked accounts not supported: ${email}`);
          return null;
        }

        return userData;
      }

      // Create a new user if one does not exist
      if (!userData) {
        const newUser = {
          _id: new ObjectId(),
          email,
          firstName,
          lastName,
          authProvider: provider,
          role: UserRoleOptions.USER,
          accreditation: AccreditationOptions.NONE,
        };

        try {
          await usersCollection.insertOne(newUser);
          return newUser;
        } catch (err) {
          console.log(`Error encountered while registering user: ${err}`);
          return null;
        }
      }

      return null;
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

      const salt = generateSalt();
      const hash = hashPassword(password, salt);

      const newUser = {
        ...userData,
        emailToken: "",
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
     * @returns   A stub user record for the newly invited user, or null if
     *            the user already exists or an error was encountered.
     */
    requestInvite: async (email: string): Promise<User.Stub | null> => {
      const stubUser = {
        _id: new ObjectId(),
        email,
        role: "stub",
        emailToken: crypto.randomBytes(3).toString("hex").toUpperCase(),
      } as const;

      try {
        // Check whether user is already registered otherwise create a new
        // record or replace existing record with new stub and invite code
        const user = await usersCollection.findOne({ email });
        if (user) {
          if (isUser(user)) return null;
          await usersCollection.deleteOne({ _id: user._id });
        }

        await usersCollection.insertOne(stubUser);
      } catch (err) {
        console.log(`Error inviting user ${email}: ${err}`);
        return null;
      }

      return stubUser;
    },

    /**
     * Initiates a password reset if the user has a crendentialed account.
     *
     * @param email  The email of the user requesting a reset.
     *
     * @returns   The reset token.
     */
    requestPasswordReset: async (email: string): Promise<string | null> => {
      const user = await usersCollection.findOne({ email });
      if (!user || !isUser(user) || !user.salt) return null;

      try {
        const token = uuid();
        await usersCollection.updateOne(
          { _id: user._id },
          { $set: { emailToken: token } }
        );

        return token;
      } catch (err) {
        console.log(
          `Error generating password reset token for ${email}: ${err}`
        );
        return null;
      }
    },

    /**
     * Sets a new password for the user.
     *
     * @param password  The new password.
     * @param emailT    The email address of the user.
     * @param token     A security token to authenticate the request.
     *
     * @returns   The user record if the password could successfully be reset
     *            and null otherwise.
     */
    resetPassword: async (
      password: string,
      email: string,
      token: string
    ): Promise<User.Mongo | null> => {
      const user = await usersCollection.findOne({ email });
      if (!user || !isUser(user) || !user.salt || user.emailToken !== token) {
        return null;
      }

      try {
        const salt = crypto.randomBytes(SALT_LENGTH).toString("hex");
        const hash = hashPassword(password, salt);

        await usersCollection.updateOne(
          { _id: user._id },
          { $set: { password: hash, salt, emailToken: "" } }
        );

        return user;
      } catch (err) {
        console.log(`Error resetting password for ${email}: ${err}`);
        return null;
      }
    },

    /*
     * Verifies and invite code used to determine whethers users can continue
     * to registration. Note, this is only used as a preliminary screen and
     * only checks whether it is a valid invite code. During registration,
     * the correct user-specific invite code is still required for successful
     * account creation.
     *
     * @param email   The invite code.
     *
     * @returns   True if the invite code is valid, and false otherwise.
     */
    verifyInvite: async (code: string): Promise<boolean> => {
      try {
        const user = await usersCollection.findOne({ emailToken: code });
        return !!user;
      } catch (err) {
        console.log(`Error verifying code ${code}: ${err}`);
        return false;
      }
    },

    /**
     * Sends an invitation from an existing user to a new user.
     *
     * @param userId  The ID the existing user sending the invitation.
     * @param email   The email address for the new user.
     *
     * @returns   A stub user record for the newly invited user, or null if
     *            the user already exists or an error was encountered.
     */
    invite: async (
      userId: MongoId,
      email: string
    ): Promise<User.Stub | null> => {
      try {
        const stubUser = await collection.requestInvite(email);
        if (!stubUser) return null;

        await usersCollection.updateOne(
          { _id: toObjectId(userId) },
          { $addToSet: { invitees: stubUser._id } }
        );

        return stubUser;
      } catch (err) {
        console.log(`Error inviting user ${email}: ${err}`);
        return null;
      }
    },

    /**
     * Reports a post as inappropriate, indicating the violation data and
     * logging under ther user record.
     *
     * @param report  Data describing the post and violation data.
     * @param userId  The id of the user reporting the post.
     *
     * @returns   A stub user record for the newly invited user, or null if
     *            the user already exists or an error was encountered.
     */
    reportPost: async (
      report: ReportedPost,
      userId: MongoId
    ): Promise<boolean> => {
      try {
        const result = await usersCollection.updateOne(
          { _id: toObjectId(userId) },
          { $addToSet: { reportedPost: report } }
        );

        return result.acknowledged;
      } catch (err) {
        console.log(
          `Error reporting post ${report.postId} user ${userId}: ${err}`
        );
        return false;
      }
    },

    /**
     * Hide or unhide a post from the home feed.
     *
     * @param hide    Whether or not to hide.
     * @param postId  The id of the post.
     * @param userId  The id the user.
     *
     * @returns   True if the hide state was successfully set, and false
     *            otherwise.
     */
    hidePost: async (
      hide: boolean,
      postId: MongoId,
      userId: MongoId
    ): Promise<boolean> => {
      try {
        const result = hide
          ? await usersCollection.updateOne(
              { _id: toObjectId(userId) },
              { $addToSet: { hiddenPostIds: toObjectId(postId) } }
            )
          : await usersCollection.updateOne(
              { _id: toObjectId(userId) },
              { $pull: { hiddenPostIds: toObjectId(postId) } }
            );

        return result.acknowledged;
      } catch (err) {
        console.log(`Error hiding post ${postId} user ${userId}: ${err}`);
        return false;
      }
    },

    /**
     * Adds a post to list of posts that should be muted so that notifications
     * of this post are not sent to the user.
     *
     * @param muted   Whether to mute or unmute this post.
     * @param postId  The id of the post.
     * @param userId  The id the user.
     *
     * @returns   True if the mute state was successfully set, and false
     *            otherwise.
     */
    mutePost: async (
      mute: boolean,
      postId: MongoId,
      userId: MongoId
    ): Promise<boolean> => {
      try {
        const result = mute
          ? await usersCollection.updateOne(
              { _id: toObjectId(userId) },
              { $addToSet: { mutedPostIds: toObjectId(postId) } }
            )
          : await usersCollection.updateOne(
              { _id: toObjectId(userId) },
              { $pull: { mutedPostIds: toObjectId(postId) } }
            );

        return result.acknowledged;
      } catch (err) {
        console.log(`Error muting post ${postId} for user ${userId}: ${err}`);
        return false;
      }
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
    updateSettings: async (
      userId: MongoId,
      settings: Settings
    ): Promise<boolean> => {
      try {
        const user = await usersCollection.findOne({ _id: toObjectId(userId) });
        if (!user || !isUser(user)) return false;

        const newSettings = {
          ...(user.settings ? user.settings : {}),
          ...settings,
        };

        await usersCollection.updateOne(
          { _id: toObjectId(userId) },
          { $set: { settings: newSettings, updatedAt: new Date() } }
        );
      } catch (err) {
        console.log(`Error updating user settings for ${userId}: ${err}`);
        return false;
      }

      return true;
    },

    /**
     * Set whether this user is following another user.
     *
     * @param follow        Whether or not this user is following another user.
     * @param followUserId  The id of the user to follow or unfollow.
     * @param userId        The id of the current user.
     *
     * @returns   True if the follow state was successfully set, and false
     *            otherwise.
     */
    setFollowingUser: async (
      follow: boolean,
      followUserId: MongoId,
      userId: MongoId
    ): Promise<boolean> => {
      try {
        const result = follow
          ? await usersCollection.updateOne(
              { _id: toObjectId(userId) },
              { $addToSet: { followingIds: toObjectId(followUserId) } }
            )
          : await usersCollection.updateOne(
              { _id: toObjectId(userId) },
              { $pull: { followingIds: toObjectId(followUserId) } }
            );

        return result.acknowledged;
      } catch (err) {
        console.log(`Error following user ${followUserId}: ${err}`);
        return false;
      }
    },

    /**
     * Set whether another user is following this user.
     *
     * @param follow        Whether or not another user is following this user.
     * @param followUserId  The id of the user that is following or unfollowing.
     * @param userId        The id of the current user.
     *
     * @returns   True if the follow state was successfully set, and false
     *            otherwise.
     */
    setFollower: async (
      following: boolean,
      followerId: MongoId,
      userId: MongoId
    ): Promise<boolean> => {
      try {
        const result = following
          ? await usersCollection.updateOne(
              { _id: toObjectId(userId) },
              { $addToSet: { followerIds: toObjectId(followerId) } }
            )
          : await usersCollection.updateOne(
              { _id: toObjectId(userId) },
              { $pull: { followerIds: toObjectId(followerId) } }
            );

        return result.acknowledged;
      } catch (err) {
        console.log(`Error setting follower ${followerId}: ${err}`);
        return false;
      }
    },

    /**
     * Set whether this user is following a company.
     *
     * @param follow            Whether or not this user is following another user.
     * @param followCompanyId   The id of the company to follow or unfollow.
     * @param userId            The id of the current user.
     *
     * @returns   True if the follow state was successfully set, and false
     *            otherwise.
     */
    setFollowingCompany: async (
      follow: boolean,
      followCompanyId: MongoId,
      userId: MongoId
    ): Promise<boolean> => {
      try {
        const result = follow
          ? await usersCollection.updateOne(
              { _id: toObjectId(userId) },
              {
                $addToSet: { companyFollowingIds: toObjectId(followCompanyId) },
              }
            )
          : await usersCollection.updateOne(
              { _id: toObjectId(userId) },
              { $pull: { companyFollowingIds: toObjectId(followCompanyId) } }
            );

        return result.acknowledged;
      } catch (err) {
        console.log(`Error following company ${followCompanyId}: ${err}`);
        return false;
      }
    },

    /**
     * Set whether this user is being followed by a company.
     *
     * @param follower            Whether or not this user is following another company.
     * @param followerCompanyId   The id of the company to follow or unfollow.
     * @param userId            The id of the current user.
     *
     * @returns   True if the follow state was successfully set, and false
     *            otherwise.
     */
    setFollowerCompany: async (
      following: boolean,
      followerCompanyId: MongoId,
      userId: MongoId
    ): Promise<boolean> => {
      try {
        const result = following
          ? await usersCollection.updateOne(
              { _id: toObjectId(userId) },
              {
                $addToSet: {
                  companyFollowerIds: toObjectId(followerCompanyId),
                },
              }
            )
          : await usersCollection.updateOne(
              { _id: toObjectId(userId) },
              { $pull: { companyFollowerIds: toObjectId(followerCompanyId) } }
            );

        return result.acknowledged;
      } catch (err) {
        console.log(
          `Error setting follower company ${followerCompanyId}: ${err}`
        );
        return false;
      }
    },

    /**
     * Set whether posts from a user should be hidden from the current user.
     *
     * @param hide          Whether or not to hide the user.
     * @param hideenUserId  The id of the user to hide.
     * @param userId        The id of the current user.
     *
     * @returns   True if the hide state was successfully set, and false
     *            otherwise.
     */
    setHideUser: async (
      hide: boolean,
      hiddenUserId: MongoId,
      userId: MongoId
    ): Promise<boolean> => {
      try {
        const result = hide
          ? await usersCollection.updateOne(
              { _id: toObjectId(userId) },
              {
                $addToSet: {
                  hiddenUserIds: toObjectId(hiddenUserId),
                },
              }
            )
          : await usersCollection.updateOne(
              { _id: toObjectId(userId) },
              { $pull: { hiddenUserIds: toObjectId(hiddenUserId) } }
            );

        return result.acknowledged;
      } catch (err) {
        console.log(`Error hiding user ${hiddenUserId}: ${err}`);
        return false;
      }
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

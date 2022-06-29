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
import { MongoId, toObjectId, toObjectIds } from "../../lib/mongo-helper";
import crypto from "crypto";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { OAuth2Client } from "google-auth-library";
import {
  User,
  UserRoleOptions,
  AccreditationOptions,
  Settings,
  ReportedPost,
  Accreditation,
  Questionnaire,
  ProRequest,
  isUser,
} from "../../schemas/user";
import { createSearchStage } from "../../lib/utils";
import {
  BadRequestError,
  InternalServerError,
  InvalidateError,
  NotFoundError,
  UnprocessableEntityError,
} from "../../lib/validate";

import "dotenv/config";
import { ERROR_CODES } from "../../lib/constants";

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

export const DEFAULT_USER_OPTIONS: Pick<
  User.Mongo,
  | "role"
  | "accreditation"
  | "settings"
  | "followingIds"
  | "postCount"
  | "followerCount"
  | "followingCount"
  | "companyFollowerCount"
  | "companyFollowingCount"
> = {
  role: UserRoleOptions.USER,
  accreditation: AccreditationOptions.NONE.value,
  settings: {
    interests: [],
    tagging: true,
    messaging: true,
    emailUnreadMessage: false,
    notifications: {
      commentLike: "sms",
      messageReceived: "sms",
      postComment: "sms",
      postCreate: "sms",
      postLike: "sms",
      tagCreate: "sms",
    },
  },
  postCount: 0,
  followerCount: 0,
  followingCount: 0,
  companyFollowerCount: 0,
  companyFollowingCount: 0,
};

export const UNIVERSAL_INVITE_CODES = [
  "C03A51",
  "98E100",
  "9FEF10",
  "08E738",
  "EFDC9F",
  "56BCDF",
  "05A1B9",
  "24569C",
  "9E7B41",
  "CCD68A",
  "D67C90",
  "521772",
  "A5A97A",
  "125859",
  "50453A",
  "F17491",
  "057FC5",
  "435847",
  "D19ACE",
  "269038",
];

const MICHAEL_USER_ID = "628fee97fef84ea6746e08fb";

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

      return usersCollection.findOne({
        ...query,
        deletedAt: { $exists: false },
      });
    },

    /**
     * Provides a list of all users stored within the DB.
     *
     * @param ids           An optional array of specific IDs to filter by.
     * @param includeStubs  Whether or not to include stub users. Defaults to
     *                      false.
     *
     * @returns {User[]}  An array of User objects.
     */
    findAll: async (
      ids: MongoId[] | undefined = undefined,
      includeStubs = false
    ): Promise<User.Mongo[]> => {
      const query = {
        ...(includeStubs ? {} : { firstName: { $exists: true } }),
        ...(ids !== undefined
          ? { _id: { $in: ids ? toObjectIds(ids) : ids } }
          : {}),
        deletedAt: { $exists: false },
      };

      return (await usersCollection.find(query).toArray()) as User.Mongo[];
    },

    /**
     * Provides a list of all professionals in the database.
     *
     * @param featured  Whether to filter by featured professionals.
     *
     * @returns The list of professionals.
     */
    professionals: async (featured = false): Promise<User.Mongo[]> =>
      (await usersCollection
        .find({
          role: "professional",
          ...(featured ? { featured: true } : {}),
          deletedAt: { $exists: false },
        })
        .toArray()) as User.FundManager[],

    /**
     * Provides a list of all fund managers in the database.
     *
     * @param featured  Whether to filter by featured fund managers.
     *
     * @returns The list of fund managers.
     */
    fundManagers: async (featured = false): Promise<User.FundManager[]> =>
      (await usersCollection
        .find({
          managedFundsIds: { $exists: true },
          ...(featured ? { featured: true } : {}),
          deletedAt: { $exists: false },
        })
        .toArray()) as User.FundManager[],

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
    ): Promise<User.Mongo> => {
      const user = await usersCollection.findOne({
        email,
        deletedAt: { $exists: false },
      });
      if (!user || !isUser(user) || !user.salt) {
        throw new NotFoundError();
      }

      // Check credentials - i.e., compare bcrypt password hashes
      if (hashPassword(password, user.salt) != user.password) {
        throw new InvalidateError("password", "password is not correct");
      }

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
    authenticateOAuth: async (user: User.OAuthInput): Promise<User.Mongo> => {
      const { email, firstName, lastName, provider, tokenId } = user;

      // Verify access tokens before fetching associated user record
      if (provider === "google") {
        // Verify google token
        const client = new OAuth2Client(process.env.GOOGLE_ID as string);
        try {
          const ticketIgnored = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOLGE_ID as string,
          });
        } catch (err) {
          throw new BadRequestError(`Invalid google access token: ${tokenId}`);
        }
      } else if (provider === "linkedin") {
        // Verify LinkedIn token
        try {
          await axios.get(
            `https://api.linkedin.com/v2/me?oauth2_access_token=${tokenId}`
          );
        } catch {
          throw new BadRequestError(
            `Invalid linkedin access token: ${tokenId}`
          );
        }
      } else {
        throw new BadRequestError(`Unsupported provider: ${provider}`);
      }

      const userData = await collection.find({ email });
      if (userData) {
        // Check to make sure that the provider that the account was created
        // with matches the provider from which this OAuth token was provided.
        if (!isUser(userData) || userData?.authProvider !== provider) {
          throw new UnprocessableEntityError(
            `Linked accounts not supported: ${email}`
          );
        }

        return userData;
      }

      // Create a new user if one does not exist
      const newUser = {
        _id: new ObjectId(),
        email,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        authProvider: provider,
        ...DEFAULT_USER_OPTIONS,
      };

      await usersCollection.insertOne(newUser);

      // Everyone follow Michael Wang")
      try {
        await collection.setFollowingUser(true, MICHAEL_USER_ID, newUser._id);
        await collection.setFollower(true, newUser._id, MICHAEL_USER_ID);
      } catch (err) {
        console.error("Error following Michael for new user", newUser._id);
      }

      return newUser;
    },

    /**
     * Registers a new user.
     *
     * @param user  User data for new account.
     *
     * @returns   The new user record.
     */
    register: async (user: User.Input): Promise<User.Mongo> => {
      const { firstName, lastName, password } = user;
      const inviteCode = user.inviteCode.toUpperCase();
      const email = user.email.toLowerCase();
      const isUniversalCode = UNIVERSAL_INVITE_CODES.includes(inviteCode);

      // Ensure user already already exists as a stub
      const userData = isUniversalCode
        ? ({
            _id: new ObjectId(),
            firstName,
            lastName,
            email,
            emailToken: inviteCode,
            role: "stub",
          } as const)
        : await collection.find({ email });
      if (!userData) {
        throw new NotFoundError();
      }
      if (isUser(userData)) {
        throw new UnprocessableEntityError("User already exists.");
      }
      if (userData.emailToken !== inviteCode) {
        throw new InvalidateError(
          "user.inviteCode",
          "invite code is not valid"
        );
      }

      const salt = generateSalt();
      const hash = hashPassword(password, salt);

      const newUser = {
        ...userData,
        email: email.toLowerCase(),
        emailToken: "",
        password: hash,
        salt,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        inviteCode,
        ...DEFAULT_USER_OPTIONS,
      };

      await usersCollection.replaceOne({ _id: userData._id }, newUser, {
        upsert: true,
      });

      // Everyone follow Michael Wang")
      try {
        await collection.setFollowingUser(true, MICHAEL_USER_ID, newUser._id);
        await collection.setFollower(true, newUser._id, MICHAEL_USER_ID);
      } catch (err) {
        console.error("Error following Michael for new user", newUser._id);
      }

      return newUser;
    },

    /**
     * Sends an invitation to a new user to join the platform.
     *
     * @param email   The email address for the new user.
     *
     * @returns   A stub user record for the newly invited user, or null if
     *            the user already exists or an error was encountered.
     */
    requestInvite: async (email: string): Promise<User.Stub> => {
      const stubUser = {
        _id: new ObjectId(),
        email,
        role: "stub",
        emailToken: crypto.randomBytes(3).toString("hex").toUpperCase(),
      } as const;

      // Check whether user is already registered otherwise create a new
      // record or replace existing record with new stub and invite code
      const user = await usersCollection.findOne({ email });
      if (user) {
        if (isUser(user)) {
          throw new UnprocessableEntityError(ERROR_CODES.USER_ALREADY_EXIST);
        }
        await usersCollection.deleteOne({ _id: user._id });
      }

      await usersCollection.insertOne(stubUser);
      return stubUser;
    },

    /**
     * Initiates a password reset if the user has a crendentialed account.
     *
     * @param email  The email of the user requesting a reset.
     *
     * @returns   The reset token.
     */
    requestPasswordReset: async (email: string): Promise<string> => {
      const user = await usersCollection.findOne({
        email,
        deletedAt: { $exists: false },
      });

      if (!user) {
        throw new NotFoundError();
      }
      if (!isUser(user) || !user.salt) {
        throw new UnprocessableEntityError("Invalid user.");
      }

      const token = uuid();
      await usersCollection.updateOne(
        { _id: user._id },
        { $set: { emailToken: token } }
      );

      return token;
    },

    /**
     * Sets a new password for the user.
     *
     * @param password  The new password.
     * @param email     The email address of the user.
     * @param token     A security token to authenticate the request.
     *
     * @returns   The user record if the password could successfully be reset
     *            and null otherwise.
     */
    resetPassword: async (
      password: string,
      email: string,
      token: string
    ): Promise<User.Mongo> => {
      const user = await usersCollection.findOne({
        email,
        deletedAt: { $exists: false },
      });
      if (!user) {
        throw new NotFoundError();
      }
      if (!isUser(user) || !user.salt) {
        throw new UnprocessableEntityError("Invalid user.");
      }
      if (user.emailToken !== token) {
        throw new BadRequestError("Token is invalid.");
      }

      const salt = crypto.randomBytes(SALT_LENGTH).toString("hex");
      const hash = hashPassword(password, salt);

      await usersCollection.updateOne(
        { _id: user._id },
        { $set: { password: hash, salt, emailToken: "" } }
      );

      return user;
    },

    /**
     * Changes the password for an authenticated user. This should only be used
     * for endpoints that are secured (i.e., the user is already logged into)
     * the app and wants to change their password. For a forgot password flow,
     * resetPassword() should be used.
     *
     * @param oldPassword   The original password.
     * @param newPassword   The new password.
     * @param email         The email address of the user.
     *
     * @returns   The user record if the password could successfully be changed
     *            and null otherwise.
     */
    updatePassword: async (
      oldPassword: string,
      newPasword: string,
      email: string
    ): Promise<User.Mongo> => {
      const user = await usersCollection.findOne({
        email,
        deletedAt: { $exists: false },
      });
      if (!user) {
        throw new NotFoundError();
      }
      if (!isUser(user) || !user.salt) {
        throw new UnprocessableEntityError("Invalid user.");
      }
      if (hashPassword(oldPassword, user.salt) != user.password) {
        throw new InvalidateError("password", "password is not correct");
      }

      const salt = crypto.randomBytes(SALT_LENGTH).toString("hex");
      const hash = hashPassword(newPasword, salt);

      await usersCollection.updateOne(
        { _id: user._id },
        { $set: { password: hash, salt, emailToken: "" } }
      );

      return user;
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
        if (UNIVERSAL_INVITE_CODES.includes(code.toUpperCase())) {
          return true;
        }

        const user = await usersCollection.findOne({
          emailToken: code,
          deletedAt: { $exists: false },
        });
        if (!user) {
          throw new NotFoundError();
        }
        return true;
      } catch (err) {
        throw new InvalidateError("code", "Invalid verification code.");
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
    invite: async (userId: MongoId, email: string): Promise<User.Stub> => {
      const stubUser = await collection.requestInvite(email);

      await usersCollection.updateOne(
        { _id: toObjectId(userId) },
        { $addToSet: { inviteeIds: stubUser._id } }
      );

      return stubUser;
    },

    /**
     * Updates a user's profile data.
     *
     * @param currentUser   The current user.
     * @param profile       The updated profile data.
     *
     * @returns   The updated user record.
     */
    updateProfile: async (
      currentUser: User.Mongo,
      profile: User.ProfileInput
    ): Promise<User.Mongo> => {
      const { _id, ...profileData } = profile;
      const keys = Object.keys(profileData);

      // Remove properties that are undefined
      keys.forEach(
        (key) => profileData[key] === undefined && delete profileData[key]
      );

      // Update full name
      let fullName = currentUser.fullName;
      if (keys.includes("firstName") || keys.includes("lastName")) {
        fullName = `${profile.firstName || currentUser.firstName} ${
          profile.lastName || currentUser.lastName
        }`;
      }

      const user = await usersCollection.findOneAndUpdate(
        {
          _id: toObjectId(_id),
          role: { $ne: "stub" },
          deletedAt: { $exists: false },
        },
        { $set: { ...profileData, fullName, updatedAt: new Date() } },
        { returnDocument: "after" }
      );

      if (!user.ok) {
        throw new InternalServerError("Unable to update user profile");
      }

      if (!user.value) {
        throw new NotFoundError("User");
      }

      return user.value as User.Mongo;
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
      const result = await usersCollection.updateOne(
        { _id: toObjectId(userId), deletedAt: { $exists: false } },
        { $addToSet: { reportedPosts: report } }
      );

      if (!result.acknowledged || result.modifiedCount === 0) {
        throw new InternalServerError("Not able to report a post.");
      }

      return true;
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
      const result = hide
        ? await usersCollection.updateOne(
            { _id: toObjectId(userId), deletedAt: { $exists: false } },
            { $addToSet: { hiddenPostIds: toObjectId(postId) } }
          )
        : await usersCollection.updateOne(
            { _id: toObjectId(userId), deletedAt: { $exists: false } },
            { $pull: { hiddenPostIds: toObjectId(postId) } }
          );

      if (!result.acknowledged || result.modifiedCount === 0) {
        throw new InternalServerError(
          `Not able to ${hide ? "" : "un"}hide a post.`
        );
      }

      return true;
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
      const result = mute
        ? await usersCollection.updateOne(
            { _id: toObjectId(userId), deletedAt: { $exists: false } },
            { $addToSet: { mutedPostIds: toObjectId(postId) } }
          )
        : await usersCollection.updateOne(
            { _id: toObjectId(userId), deletedAt: { $exists: false } },
            { $pull: { mutedPostIds: toObjectId(postId) } }
          );

      if (!result.acknowledged || result.modifiedCount === 0) {
        throw new InternalServerError(
          `Not able to ${mute ? "" : "un"}mute a post.`
        );
      }

      return true;
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
      const user = await usersCollection.findOne({ _id: toObjectId(userId) });
      if (!user || !isUser(user)) {
        throw new NotFoundError();
      }

      const newSettings = {
        ...(user.settings ? user.settings : {}),
        ...settings,
      };

      await usersCollection.updateOne(
        { _id: toObjectId(userId), deletedAt: { $exists: false } },
        { $set: { settings: newSettings, updatedAt: new Date() } }
      );

      return true;
    },

    /**
     * Set whether a particular fund is on the user's watchlist.
     *
     * @param add           Whether to add or remove the fund.
     * @param fundId        The id of the fund.
     * @param userId        The id of the current user.
     *
     * @returns   True if the fund was successfully added or removed and false
     *            otherwise.
     */
    setOnWatchlist: async (
      add: boolean,
      fundId: MongoId,
      userId: MongoId
    ): Promise<User.Mongo> => {
      const result = add
        ? await usersCollection.findOneAndUpdate(
            {
              _id: toObjectId(userId),
              role: { $ne: "stub" },
              deletedAt: { $exists: false },
            },
            { $addToSet: { watchlistIds: toObjectId(fundId) } },
            { returnDocument: "after" }
          )
        : await usersCollection.findOneAndUpdate(
            {
              _id: toObjectId(userId),
              role: { $ne: "stub" },
              deletedAt: { $exists: false },
            },
            { $pull: { watchlistIds: toObjectId(fundId) } },
            { returnDocument: "after" }
          );

      const { value } = result;
      if (!result.ok || !value) {
        throw new InternalServerError(`Not able to update watch list.`);
      }

      return value as User.Mongo;
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
    ): Promise<User.Mongo> => {
      const result = follow
        ? await usersCollection.findOneAndUpdate(
            { _id: toObjectId(userId), deletedAt: { $exists: false } },
            { $addToSet: { followingIds: toObjectId(followUserId) } },
            { returnDocument: "after" }
          )
        : await usersCollection.findOneAndUpdate(
            { _id: toObjectId(userId), deletedAt: { $exists: false } },
            { $pull: { followingIds: toObjectId(followUserId) } },
            { returnDocument: "after" }
          );

      const { value } = result;
      if (!result.ok || !value) {
        throw new InternalServerError(
          `Not able to follow user ${followUserId}.`
        );
      }

      return value as User.Mongo;
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
    ): Promise<User.Mongo> => {
      const result = following
        ? await usersCollection.findOneAndUpdate(
            { _id: toObjectId(userId), deletedAt: { $exists: false } },
            { $addToSet: { followerIds: toObjectId(followerId) } },
            { returnDocument: "after" }
          )
        : await usersCollection.findOneAndUpdate(
            { _id: toObjectId(userId), deletedAt: { $exists: false } },
            { $pull: { followerIds: toObjectId(followerId) } },
            { returnDocument: "after" }
          );

      const { value } = result;
      if (!result.ok || !value) {
        throw new InternalServerError(
          `Not able to add follower ${followerId}.`
        );
      }

      return value as User.Mongo;
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
    ): Promise<User.Mongo> => {
      const result = follow
        ? await usersCollection.findOneAndUpdate(
            { _id: toObjectId(userId), deletedAt: { $exists: false } },
            {
              $addToSet: { companyFollowingIds: toObjectId(followCompanyId) },
            },
            { returnDocument: "after" }
          )
        : await usersCollection.findOneAndUpdate(
            { _id: toObjectId(userId), deletedAt: { $exists: false } },
            { $pull: { companyFollowingIds: toObjectId(followCompanyId) } },
            { returnDocument: "after" }
          );

      const { value } = result;
      if (!result.ok || !value) {
        throw new InternalServerError(
          `Not able to follow company ${followCompanyId}.`
        );
      }

      return value as User.Mongo;
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
    ): Promise<User.Mongo> => {
      const result = following
        ? await usersCollection.findOneAndUpdate(
            { _id: toObjectId(userId), deletedAt: { $exists: false } },
            {
              $addToSet: {
                companyFollowerIds: toObjectId(followerCompanyId),
              },
            },
            { returnDocument: "after" }
          )
        : await usersCollection.findOneAndUpdate(
            { _id: toObjectId(userId), deletedAt: { $exists: false } },
            { $pull: { companyFollowerIds: toObjectId(followerCompanyId) } },
            { returnDocument: "after" }
          );

      const { value } = result;
      if (!result.ok || !value) {
        throw new InternalServerError(
          `Not able to add following company ${followerCompanyId}.`
        );
      }

      return value as User.Mongo;
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
              { _id: toObjectId(userId), deletedAt: { $exists: false } },
              {
                $addToSet: {
                  hiddenUserIds: toObjectId(hiddenUserId),
                },
              }
            )
          : await usersCollection.updateOne(
              { _id: toObjectId(userId), deletedAt: { $exists: false } },
              { $pull: { hiddenUserIds: toObjectId(hiddenUserId) } }
            );

        return result.acknowledged;
      } catch (err) {
        console.log(`Error hiding user ${hiddenUserId}: ${err}`);
        return false;
      }
    },

    /**
     * Saves an accreditation questionnaire response to the user record.
     *
     * @param userId  The ID of the user record to deserialize.
     *
     * @returns A deserialized object contains the _id, user role, and
     *          accreditation status for the user.
     */
    saveQuestionnaire: async (
      userId: MongoId,
      questionnaire: Questionnaire
    ): Promise<User.Mongo | null> => {
      let accreditation: Accreditation = "none";
      const { class: investorClass, status } = questionnaire;

      if (investorClass === "advisor") {
        accreditation = "purchaser";
      } else {
        if (status.length > 0) {
          accreditation = "accredited";
        }

        if (investorClass === "individual") {
          if (status.includes("$2.2M")) accreditation = "client";
          if (status.includes("$5M")) accreditation = "purchaser";
        } else if (investorClass === "entity") {
          if (status.includes("tier1-ai-owners")) accreditation = "client";
          if (
            status.includes("qp-owners") ||
            status.includes("trust-assets") ||
            status.includes("tier3")
          ) {
            accreditation = "purchaser";
          }
        }
      }

      const user = await usersCollection.findOneAndUpdate(
        {
          _id: toObjectId(userId),
          role: { $ne: "stub" },
          deletedAt: { $exists: false },
        },
        {
          $set: {
            questionnaire: {
              ...questionnaire,
              date: new Date(questionnaire.date),
            },
            accreditation,
          },
        },
        { returnDocument: "after" }
      );

      return user.value as User.Mongo | null;
    },

    /**
     * Saves request information sent by the user to become a professional
     * within the application.
     *
     * @param request   The request information.
     * @param userId    The ID of the user making the request.
     *
     * @returns   The updated user record, if found.
     */
    saveProRequest: async (
      request: ProRequest,
      userId: MongoId
    ): Promise<User.Mongo> => {
      const user = await usersCollection.findOneAndUpdate(
        {
          _id: toObjectId(userId),
          role: { $ne: "stub" },
          deletedAt: { $exists: false },
        },
        { $set: { proRequest: request } },
        { returnDocument: "after" }
      );

      if (!user.value) {
        throw new NotFoundError();
      }

      return user.value as User.Mongo;
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
    deserialize: async (userId: MongoId): Promise<DeserializedUser> => {
      const user = await usersCollection.findOne({
        _id: toObjectId(userId),
        deletedAt: { $exists: false },
      });
      if (!user || !isUser(user)) {
        throw new NotFoundError();
      }

      const { _id, role, accreditation } = user;

      return {
        _id: _id.toString(),
        role,
        acc: accreditation,
      };
    },

    /**
     * Updates a fcm token.
     *
     * @param userId    The ID the existing user.
     * @param fcmToken  The new fcm token
     *
     * @returns         true
     */
    updateFcmToken: async (
      userId: MongoId,
      fcmToken: string
    ): Promise<boolean> => {
      const user = await usersCollection.findOneAndUpdate(
        {
          _id: toObjectId(userId),
          role: { $ne: "stub" },
          deletedAt: { $exists: false },
        },
        {
          $set: {
            fcmToken,
            fcmTokenCreated: new Date(),
            updatedAt: new Date(),
          },
        },
        { returnDocument: "after" }
      );

      if (!user.ok) {
        throw new InternalServerError("Unable to update fcm token");
      }

      if (!user.value) {
        throw new NotFoundError("User");
      }

      return true;
    },

    /**
     * Provides a list of users searched by keyword.
     *
     * @param search  Search keyword.
     * @param limit   Optional limit for search result. Defaults to 10.
     *
     * @returns The list of users.
     */
    findByKeyword: async (search = "", limit = 10): Promise<User.Mongo[]> => {
      const stage = createSearchStage("fullName", search);
      if (!stage) {
        return [];
      }

      const users = (await usersCollection
        .aggregate([
          {
            $search: { ...stage },
          },
          {
            $match: {
              deletedAt: { $exists: false },
            },
          },
          {
            $limit: limit,
          },
        ])
        .toArray()) as User.Mongo[];

      return users;
    },

    /**
     * Soft delete a user account.
     *
     * @param userId  The id of the user.
     *
     * @returns   True if the user was successfully deleted and false
     *            otherwise.
     */
    delete: async (userId: MongoId): Promise<boolean> => {
      const result = await usersCollection.findOneAndUpdate(
        {
          _id: toObjectId(userId),
          deletedAt: { $exists: false },
        },
        { $set: { deletedAt: new Date() } }
      );

      if (!result.ok || !result.value) {
        throw new NotFoundError();
      }

      return true;
    },
  };

  return collection;
};

export default createUsersCollection;

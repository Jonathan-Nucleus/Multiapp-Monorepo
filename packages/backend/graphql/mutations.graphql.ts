import { gql } from "apollo-server";
import * as yup from "yup";
import _ from "lodash";
import { PrometheusMailer } from "../email";
import "yup-phone";

import {
  PartialSchema,
  ApolloServerContext,
  secureEndpoint,
} from "../lib/apollo/apollo-helper";
import {
  getAccessToken,
  getResetToken,
  decodeToken,
  decodeTranscoderToken,
  AccessToken,
  ResetTokenPayload,
} from "../lib/tokens";
import { registerUser } from "../lib/get-stream";
import { getUploadUrl, RemoteUpload, movePostMedia } from "../lib/s3-helper";
import {
  isObjectId,
  NotFoundError,
  UnprocessableEntityError,
  BadRequestError,
  validateArgs,
  InternalServerError,
} from "../lib/apollo/validate";

import {
  User,
  Settings,
  ReportedPost,
  Questionnaire,
  InvestorClassOptions,
  FinancialStatusOptions,
  compareAccreditation,
  PostViolationOptions,
  ProRequest,
  ProRoleOptions,
} from "../schemas/user";
import type { Company } from "../schemas/company";
import { AudienceOptions, PostCategoryOptions } from "../schemas/post";
import type { Post, Media as PostMedia } from "../schemas/post";
import type { Comment } from "../schemas/comment";
import {
  HelpRequest,
  HelpRequestTypeOptions,
  PreferredTimeOfDayOptions,
} from "../schemas/help-request";

const schema = gql`
  type Mutation {
    register(user: UserInput!): String
    login(email: String!, password: String!): String
    loginOAuth(user: OAuthUserInput!): String
    requestPasswordReset(email: String!): Boolean!
    resetPassword(password: String!, token: String!): String
    updatePassword(oldPassword: String!, newPassword: String!): String
    requestInvite(email: String!): Boolean
    inviteUser(email: String!): Boolean!
    updateSettings(settings: SettingsInput!): Boolean
    updateUserProfile(profile: UserProfileInput): UserProfile
    updateCompanyProfile(profile: CompanyProfileInput): Company
    deleteAccount: Boolean

    createPost(post: PostInput!): Post
    editPost(post: PostUpdate!): Post
    sharePost(postId: ID!, post: SharePostInput!): Post
    deletePost(postId: ID!): Boolean
    featurePost(postId: ID!, feature: Boolean!): Post
    updatePostMedia(token: String!): Boolean!
    likePost(like: Boolean!, postId: ID!): Post
    likeComment(like: Boolean!, commentId: ID!): Comment
    reportPost(report: ReportedPostInput!): Boolean
    hidePost(hide: Boolean!, postId: ID!): Boolean
    mutePost(mute: Boolean!, postId: ID!): Boolean
    comment(comment: CommentInput!): Comment
    editComment(comment: CommentUpdate!): Comment
    deleteComment(commentId: ID!): Boolean
    uploadLink(localFilename: String!, type: MediaType!, id: ID!): MediaUpload
    saveQuestionnaire(questionnaire: QuestionnaireInput!): User
    proRequest(request: ProRequestInput!): Boolean

    watchFund(watch: Boolean!, fundId: ID!): UserProfile
    followUser(follow: Boolean!, userId: ID!, asCompanyId: ID): FollowUserResult
    followCompany(
      follow: Boolean!
      companyId: ID!
      asCompanyId: ID
    ): FollowCompanyResult
    hideUser(hide: Boolean!, userId: ID!): Boolean!

    readNotification(notificationId: ID): Boolean!
    seenNotification(notificationId: ID): Boolean!
    updateFcmToken(fcmToken: String): Boolean
    helpRequest(request: HelpRequestInput!): Boolean
  }

  type FollowUserResult {
    account: UserProfile
    accountCompany: Company
    userAccount: UserProfile!
  }

  type FollowCompanyResult {
    account: UserProfile
    accountCompany: Company
    company: Company!
  }

  type MediaUpload {
    remoteName: String!
    uploadUrl: String!
  }

  enum MediaType {
    POST
    AVATAR
    BACKGROUND
    FUND
  }
`;

export type MediaUpload = RemoteUpload;
export type MediaType = "POST" | "AVATAR" | "BACKGROUND" | "FUND";

type FollowUserResult = {
  account?: User.Mongo;
  accountCompany?: Company.Mongo;
  userAccount: User.Mongo;
};

type FollowCompanyResult = {
  account?: User.Mongo;
  accountCompany?: Company.Mongo;
  company: Company.Mongo;
};

const handleFollowUser = async (
  { db, user }: ApolloServerContext,
  userId: string,
  follow: boolean,
  asCompanyId?: string
): Promise<FollowUserResult> => {
  // Check user exists
  const userData = await db.users.find({ _id: userId });
  if (!userData) {
    throw new NotFoundError();
  }

  if (asCompanyId) {
    // Check company exists
    const companyData = await db.companies.find(asCompanyId);
    if (!companyData) {
      throw new NotFoundError("Company");
    }

    return {
      userAccount: await db.users.setFollowerCompany(
        follow,
        asCompanyId,
        userId
      ),
      accountCompany: await db.companies.setFollowingUser(
        follow,
        userId,
        asCompanyId
      ),
    };
  }

  if (!user?._id) {
    throw new UnprocessableEntityError("Invalid user.");
  }

  const updatedAccount = await db.users.setFollowingUser(
    follow,
    userId,
    user._id
  );
  const updatedUser = await db.users.setFollower(follow, user._id, userId);

  const followed = !!updatedAccount && !!updatedUser;

  if (!followed) {
    throw new InternalServerError("Not able to follow.");
  }

  // Send notification
  if (follow && followed) {
    db.notifications.create(user, "followed-by-user", [userId]);
  }

  return {
    account: updatedAccount,
    userAccount: updatedUser,
  };
};

const handleFollowCompany = async (
  { db, user }: ApolloServerContext,
  companyId: string,
  follow: boolean,
  asCompanyId?: string
): Promise<FollowCompanyResult> => {
  if (companyId === asCompanyId) {
    throw new UnprocessableEntityError("Invalid company.");
  }

  const companyData = await db.companies.find(companyId);
  if (!companyData) {
    throw new NotFoundError("Company");
  }

  if (asCompanyId) {
    const asCompanyData = await db.companies.find(asCompanyId);
    if (!asCompanyData) {
      throw new NotFoundError("Company");
    }

    return {
      accountCompany: await db.companies.setFollowingCompany(
        follow,
        companyId,
        asCompanyId
      ),
      company: await db.companies.setFollowerCompany(
        follow,
        asCompanyId,
        companyId
      ),
    };
  }

  if (!user?._id) {
    throw new UnprocessableEntityError("Invalid user.");
  }

  return {
    company: await db.companies.setFollower(follow, user._id, companyId),
    account: await db.users.setFollowingCompany(follow, companyId, user._id),
  };
};

const resolvers = {
  Mutation: {
    register: async (
      parentIgnored: unknown,
      args: { user: User.Input },
      { db }: ApolloServerContext
    ): Promise<AccessToken> => {
      const validator = yup
        .object()
        .shape({
          user: yup
            .object()
            .shape({
              email: yup.string().email().required(),
              firstName: yup.string().required(),
              lastName: yup.string().required(),
              password: yup.string().required(),
              inviteCode: yup.string().required(),
            })
            .required(),
        })
        .required();

      validateArgs(validator, args);

      const { user } = args;
      const userData = await db.users.register(user);

      const userCompany = userData.companyIds?.[0]
        ? await db.companies.find(userData.companyIds[0])
        : null;
      await registerUser(userData, userCompany);

      const deserializedUser = await db.users.deserialize(userData._id);
      return getAccessToken(deserializedUser);
    },

    login: async (
      parentIgnored: User.Mongo,
      args: { email: string; password: string },
      { db }: ApolloServerContext
    ): Promise<AccessToken> => {
      const validator = yup
        .object()
        .shape({
          email: yup.string().email().required(),
          password: yup.string().required(),
        })
        .required();

      validateArgs(validator, args);

      const { email, password } = args;

      const user = await db.users.authenticate(email.toLowerCase(), password);
      const userCompany = user.companyIds?.[0]
        ? await db.companies.find(user.companyIds[0])
        : null;
      await registerUser(user, userCompany);

      const deserializedUser = await db.users.deserialize(user._id);

      return getAccessToken(deserializedUser);
    },

    loginOAuth: async (
      parentIgnored: unknown,
      args: { user: User.OAuthInput },
      { db }: ApolloServerContext
    ): Promise<AccessToken | null> => {
      const validator = yup
        .object()
        .shape({
          user: yup
            .object()
            .shape({
              email: yup.string().email().required(),
              firstName: yup.string().required(),
              lastName: yup.string().required(),
              provider: yup.string().required(),
              tokenId: yup.string().required(),
            })
            .required(),
        })
        .required();

      validateArgs(validator, args);

      const { user } = args;

      const authUser = await db.users.authenticateOAuth(user);
      const userCompany = authUser.companyIds?.[0]
        ? await db.companies.find(authUser.companyIds[0])
        : null;
      await registerUser(authUser, userCompany);

      const deserializedUser = await db.users.deserialize(authUser._id);
      return getAccessToken(deserializedUser);
    },

    requestInvite: async (
      parentIgnored: unknown,
      args: { email: string },
      { db }: ApolloServerContext
    ): Promise<boolean | null> => {
      const validator = yup
        .object()
        .shape({
          email: yup.string().email().required(),
        })
        .required();

      validateArgs(validator, args);

      const { email } = args;

      const stubUser = await db.users.requestInvite(email.toLowerCase());

      return await PrometheusMailer.sendInviteCode(
        email.toLowerCase(),
        stubUser.emailToken as string
      );
    },

    requestPasswordReset: async (
      parentIgnored: unknown,
      args: { email: string },
      { db }: ApolloServerContext
    ): Promise<boolean> => {
      const validator = yup
        .object()
        .shape({
          email: yup.string().email().required(),
        })
        .required();

      validateArgs(validator, args);

      const { email } = args;

      const emailToken = await db.users.requestPasswordReset(email);

      const token = getResetToken(email, emailToken);
      return await PrometheusMailer.sendForgotPassword(email, token);
    },

    resetPassword: async (
      parentIgnored: unknown,
      args: { password: string; token: string },
      { db }: ApolloServerContext
    ): Promise<AccessToken | null> => {
      const validator = yup
        .object()
        .shape({
          password: yup.string().required(),
          token: yup.string().required(),
        })
        .required();

      validateArgs(validator, args);

      const { token, password } = args;

      const payload = decodeToken(token);

      const { email, tkn } = payload as ResetTokenPayload;
      const user = await db.users.resetPassword(password, email, tkn);

      const deserializedUser = await db.users.deserialize(user._id);
      return getAccessToken(deserializedUser);
    },

    updatePassword: secureEndpoint(
      async (
        parentIgnored,
        args: { oldPassword: string; newPassword: string },
        { db, user }
      ): Promise<AccessToken | null> => {
        const validator = yup
          .object()
          .shape({
            oldPassword: yup.string().required(),
            newPassword: yup.string().required(),
          })
          .required();

        validateArgs(validator, args);

        const { oldPassword, newPassword } = args;
        const updatedUser = await db.users.updatePassword(
          oldPassword,
          newPassword,
          user.email
        );

        const deserializedUser = await db.users.deserialize(updatedUser._id);
        return getAccessToken(deserializedUser);
      }
    ),

    inviteUser: secureEndpoint(
      async (
        parentIgnored,
        args: { email: string },
        { db, user }
      ): Promise<boolean | null> => {
        const validator = yup
          .object()
          .shape({
            email: yup.string().email().required(),
          })
          .required();

        validateArgs(validator, args);

        const { email } = args;

        const stubUser = await db.users.invite(user._id, email.toLowerCase());

        return await PrometheusMailer.sendInviteCode(
          email.toLowerCase(),
          stubUser.emailToken as string,
          user
        );
      }
    ),

    updateSettings: secureEndpoint(
      async (
        parentIgnored,
        args: { settings: Settings },
        { db, user }
      ): Promise<boolean> => {
        const validator = yup
          .object()
          .shape({
            settings: yup
              .object()
              .shape({
                interests: yup.array().of(yup.string().required()),
              })
              .required(),
          })
          .required();

        validateArgs(validator, args);

        const { settings } = args;

        return db.users.updateSettings(user._id, settings);
      }
    ),

    updateUserProfile: secureEndpoint(
      async (
        parentIgnored,
        args: { profile: User.ProfileInput },
        { db, user }
      ): Promise<User.Mongo> => {
        const validator = yup
          .object({
            profile: yup
              .object({
                _id: yup.string().required().test({
                  test: isObjectId,
                  message: "Invalid user id",
                }),
                firstName: yup.string(),
                lastName: yup.string(),
                position: yup.string(),
                avatar: yup.string(),
                background: yup
                  .object({
                    url: yup.string().required(),
                    x: yup.number().required(),
                    y: yup.number().required(),
                    width: yup.number().required(),
                    height: yup.number().required(),
                    scale: yup.number().required(),
                  })
                  .default(undefined),
                tagline: yup.string(),
                overview: yup.string(),
                website: yup.string().url(),
                linkedIn: yup.string().url(),
                twitter: yup.string().url(),
              })
              .required(),
          })
          .required();

        validateArgs(validator, args);

        const { profile } = args;
        if (profile._id !== user._id.toString()) {
          throw new BadRequestError("Not authorized");
        }

        return db.users.updateProfile(user, profile);
      }
    ),

    updateCompanyProfile: secureEndpoint(
      async (
        parentIgnored,
        args: { profile: Company.ProfileInput },
        { db, user }
      ): Promise<Company.Mongo> => {
        const validator = yup
          .object({
            profile: yup
              .object({
                _id: yup.string().required().test({
                  test: isObjectId,
                  message: "Invalid company id",
                }),
                name: yup.string(),
                avatar: yup.string(),
                background: yup
                  .object({
                    url: yup.string().required(),
                    x: yup.number().required(),
                    y: yup.number().required(),
                    width: yup.number().required(),
                    height: yup.number().required(),
                    scale: yup.number().required(),
                  })
                  .default(undefined),
                tagline: yup.string(),
                overview: yup.string(),
                website: yup.string().url(),
                linkedIn: yup.string().url(),
                twitter: yup.string().url(),
              })
              .required(),
          })
          .required();

        validateArgs(validator, args);

        const { profile } = args;
        const company = await db.companies.find(profile._id);

        if (!company) {
          throw new NotFoundError("Company");
        }
        if (!company.memberIds.some((memberId) => memberId.equals(user._id))) {
          throw new BadRequestError("Not authorized");
        }

        return db.companies.updateProfile(profile);
      }
    ),

    saveQuestionnaire: secureEndpoint(
      async (
        parentIgnored,
        args: { questionnaire: Questionnaire },
        { db, user }
      ): Promise<User.Mongo | null> => {
        const validator = yup
          .object({
            questionnaire: yup
              .object({
                class: yup
                  .string()
                  .oneOf(
                    Object.values(InvestorClassOptions).map(
                      (option) => option.value
                    )
                  )
                  .required(),
                status: yup
                  .array()
                  .min(0)
                  .of(
                    yup
                      .string()
                      .oneOf(
                        Object.values(FinancialStatusOptions).map(
                          (option) => option.value
                        )
                      )
                      .required()
                  )
                  .required(),
                date: yup.date().required(),
                advisorRequest: yup
                  .object()
                  .notRequired()
                  .when("class", {
                    is: "advisor",
                    then: yup
                      .object({
                        firm: yup.string().trim().required("Required"),
                        crd: yup.string().trim().required("Required"),
                        phone: yup
                          .string()
                          .phone(
                            undefined,
                            false,
                            "Oops, looks like an invalid phone number"
                          )
                          .required("Required"),
                        email: yup
                          .string()
                          .email("Must be a valid email")
                          .required("Required"),
                        contactMethod: yup
                          .string()
                          .oneOf(
                            Object.values(HelpRequestTypeOptions).map(
                              (option) => option.value
                            )
                          )
                          .required(),
                      })
                      .required(),
                  }),
              })
              .required(),
          })
          .required();

        validateArgs(validator, args);

        const { questionnaire } = args;

        const userData = await db.users.saveQuestionnaire(user._id, {
          ...questionnaire,
          status: Array.from(new Set(questionnaire.status)), // Ensure unique values
        });

        if (userData) {
          let result = await PrometheusMailer.sendFormCRS(userData);
          if (!result) {
            console.log(
              "Error sending form CRS confirmation for user",
              userData._id
            );
          }

          if (questionnaire.class === "advisor") {
            result = await PrometheusMailer.sendFARequest(userData);
            if (!result) {
              console.log("Error sending FA request for user", userData._id);
            }
          }
        }

        return userData;
      }
    ),

    proRequest: secureEndpoint(
      async (
        parentIgnored,
        args: { request: ProRequest },
        { db, user }
      ): Promise<boolean> => {
        const validator = yup
          .object({
            request: yup
              .object({
                role: yup
                  .string()
                  .oneOf(
                    Object.values(ProRoleOptions).map((option) => option.value)
                  )
                  .required(),
                otherRole: yup.string().when("role", {
                  is: "other",
                  then: yup.string().required(),
                }),
                email: yup.string().email().required(),
                organization: yup.string().when("role", {
                  is: "other",
                  then: yup.string().required(),
                }),
                position: yup.string().required(),
                info: yup.string().notRequired(),
              })
              .required(),
          })
          .required();

        validateArgs(validator, args);

        const { request } = args;

        const userData = await db.users.saveProRequest(request, user._id);
        await PrometheusMailer.sendProRequest(userData);

        return true;
      }
    ),

    createPost: secureEndpoint(
      async (
        parentIgnored,
        args: { post: Post.Input },
        { db, user }
      ): Promise<Post.Mongo> => {
        const validator = yup
          .object()
          .shape({
            post: yup
              .object()
              .shape({
                audience: yup
                  .string()
                  .oneOf(Object.values(AudienceOptions))
                  .required(),
                categories: yup
                  .array()
                  .of(
                    yup
                      .string()
                      .oneOf(_.map(Object.values(PostCategoryOptions), "value"))
                      .required()
                  )
                  .required(),
                body: yup
                  .string()
                  .notRequired()
                  .when("attachments", {
                    is: (attachments: PostMedia[]) =>
                      !attachments || attachments.length === 0,
                    then: yup.string().required("Required"),
                  }),
                attachments: yup
                  .array()
                  .of(
                    yup.object({
                      url: yup.string().required(),
                      aspectRatio: yup.number().required(),
                      documentLink: yup.string(),
                    })
                  )
                  .ensure()
                  .default([])
                  .notRequired(),
                media: yup
                  .object({
                    url: yup.string().required(),
                    aspectRatio: yup.number().required(),
                    documentLink: yup.string(),
                  })
                  .notRequired()
                  .default(undefined),
                mentionIds: yup.array().of(
                  yup.string().test({
                    test: isObjectId,
                    message: "Invalid mention id",
                  })
                ),
                companyId: yup
                  .string()
                  .test({
                    test: isObjectId,
                    message: "Invalid company id",
                  })
                  .notRequired(),
              })
              .required(),
          })
          .required();

        validateArgs(validator, args);

        const { post } = args;
        if (
          post.companyId &&
          !user.companyIds?.find(
            (companyId) => companyId.toString() === post.companyId
          )
        ) {
          throw new BadRequestError("Not authorized");
        }

        // For backward/forward-compatability, if the media field is present
        // on the post data, copy the data over to the new attachments field.
        // Also copy the first item from the attachments field to media.
        const migratedPost = {
          ...post,
          ...(post.media ? { attachments: [post.media] } : {}),
          ...(post.attachments ? { media: post.attachments[0] } : {}),
        };
        const postData = await db.posts.create(migratedPost, user._id);

        // Move AWS media to the appropriate post folder
        if (postData.attachments) {
          const moveAttachmentsResults = await Promise.all(
            postData.attachments?.map(async (attachment) =>
              movePostMedia(
                user._id.toString(),
                postData.userId.toString(),
                postData._id.toString(),
                attachment.url
              )
            ) ?? []
          );
          if (moveAttachmentsResults.some((result) => !result)) {
            console.log(
              "Error moving attachments",
              postData.attachments?.map((item) => item.url),
              "for post",
              postData._id,
              moveAttachmentsResults
            );
          } else if (
            moveAttachmentsResults.every((result) => result.mediaReady)
          ) {
            await db.posts.setVisible(postData._id, true, postData.userId);
          }
        }

        // Send Notification
        const mentionIds = postData?.mentionIds ?? [];
        await Promise.all(
          mentionIds.map((mentionId) => {
            return db.notifications.create(
              user,
              "tagged-in-post",
              [mentionId],
              {
                postId: postData._id,
              }
            );
          })
        );

        // Send Notification to followers
        const followerIds = user?.followerIds ?? [];
        await Promise.all(
          followerIds.map((followerId) => {
            return db.notifications.create(
              user,
              "create-post",
              [followerId],
              {
                postId: postData._id,
              }
            );
          })
        );

        return postData;
      }
    ),

    editPost: secureEndpoint(
      async (
        parentIgnored,
        args: { post: Post.Update },
        { db, user }
      ): Promise<Post.Mongo> => {
        const validator = yup
          .object()
          .shape({
            post: yup
              .object()
              .shape({
                _id: yup.string().required().test({
                  test: isObjectId,
                  message: "Invalid post id",
                }),
                audience: yup
                  .string()
                  .oneOf(Object.values(AudienceOptions))
                  .required(),
                categories: yup
                  .array()
                  .of(
                    yup
                      .string()
                      .oneOf(_.map(Object.values(PostCategoryOptions), "value"))
                      .required()
                  )
                  .required(),
                body: yup
                  .string()
                  .notRequired()
                  .when("attachments", {
                    is: (attachments: PostMedia[]) =>
                      !attachments || attachments.length === 0,
                    then: yup.string().required("Required"),
                  }),
                attachments: yup
                  .array()
                  .of(
                    yup.object({
                      url: yup.string().required(),
                      aspectRatio: yup.number().required(),
                      documentLink: yup.string(),
                    })
                  )
                  .ensure()
                  .default([])
                  .notRequired(),
                media: yup
                  .object({
                    url: yup.string().required(),
                    aspectRatio: yup.number().required(),
                    documentLink: yup.string(),
                  })
                  .notRequired()
                  .default(undefined),
                mentionIds: yup.array().of(
                  yup.string().test({
                    test: isObjectId,
                    message: "Invalid mention id",
                  })
                ),
                userId: yup.string().required().test({
                  test: isObjectId,
                  message: "Invalid user id",
                }),
              })
              .required(),
          })
          .required();

        validateArgs(validator, args);

        const { post: postData } = args;
        // For backward/forward-compatability, if the media field is present
        // on the post data, copy the data over to the new attachments field.
        // Also copy the first item from the attachments field to media.
        const post = {
          ...postData,
          ...(postData.media ? { attachments: [postData.media] } : {}),
          ...(postData.attachments ? { media: postData.attachments[0] } : {}),
        };

        if (
          user._id.toString() !== post.userId &&
          !user.companyIds?.find(
            (companyId) => companyId.toString() === post.userId
          )
        ) {
          throw new BadRequestError("Not authorized");
        }

        const originalPost = await db.posts.find(post._id);
        if (!originalPost) {
          throw new NotFoundError("Post");
        }

        // Move AWS media to the appropriate post folder
        if (post.attachments) {
          const originalAttachments =
            originalPost.attachments?.map((attachment) => attachment.url) ?? [];
          const moveAttachmentsResults = await Promise.all(
            post.attachments
              ?.filter(
                (attachment) => !originalAttachments.includes(attachment.url)
              )
              .map(async (attachment) =>
                movePostMedia(
                  user._id.toString(),
                  post.userId.toString(),
                  post._id.toString(),
                  attachment.url
                )
              )
          );
          if (moveAttachmentsResults.some((result) => !result.success)) {
            console.log(
              "Error moving attachments",
              post.attachments?.map((item) => item.url),
              "for post",
              post._id,
              moveAttachmentsResults
            );
          } else if (
            moveAttachmentsResults.every((result) => result.mediaReady)
          ) {
            await db.posts.setVisible(post._id, true, post.userId);
          }
        }

        return db.posts.edit(post, post.userId);
      }
    ),

    sharePost: secureEndpoint(
      async (
        parentIgnored,
        args: { postId: string; post: Post.ShareInput },
        { db, user }
      ): Promise<Post.Mongo> => {
        const validator = yup
          .object()
          .shape({
            postId: yup.string().required().test({
              test: isObjectId,
              message: "Invalid post id",
            }),
            post: yup
              .object()
              .shape({
                body: yup.string().required(),
                mentionIds: yup.array().of(
                  yup.string().test({
                    test: isObjectId,
                    message: "Invalid mention id",
                  })
                ),
                companyId: yup
                  .string()
                  .test({
                    test: isObjectId,
                    message: "Invalid company id",
                  })
                  .notRequired(),
              })
              .required(),
          })
          .required();

        validateArgs(validator, args);

        const { postId, post } = args;
        if (
          post.companyId &&
          !user.companyIds?.find(
            (companyId) => companyId.toString() === post.companyId
          )
        ) {
          throw new BadRequestError("Not authorized");
        }

        const postData = await db.posts.share(postId, post, user._id);
        return postData;
      }
    ),

    deletePost: secureEndpoint(
      async (
        parentIgnored,
        args: { postId: string },
        { db, user }
      ): Promise<boolean> => {
        const validator = yup
          .object()
          .shape({
            postId: yup.string().required().test({
              test: isObjectId,
              message: "Invalid post id",
            }),
          })
          .required();

        validateArgs(validator, args);

        const { postId } = args;

        return db.posts.delete(postId, user._id, user.companyIds ?? []);
      }
    ),

    featurePost: secureEndpoint(
      async (
        parentIgnored,
        args: { postId: string; feature: boolean },
        { db, user }
      ): Promise<Post.Mongo> => {
        const validator = yup
          .object()
          .shape({
            postId: yup.string().required().test({
              test: isObjectId,
              message: "Invalid post id",
            }),
            feature: yup.bool().required(),
          })
          .required();

        validateArgs(validator, args);

        const { postId, feature } = args;

        return db.posts.feature(postId, user._id, feature);
      }
    ),

    updatePostMedia: async (
      parentIgnored: unknown,
      { token }: { token: string },
      { db }: ApolloServerContext
    ) => {
      try {
        const { mediaUrl, postId } = decodeTranscoderToken(token);
        await db.posts.updatePostAttachment(postId, mediaUrl);

        return true;
      } catch (err) {
        console.log("Error updating post media:", err);
        return false;
      }
    },

    likePost: secureEndpoint(
      async (
        parentIgnored,
        args: { postId: string; like: boolean },
        { db, user }
      ): Promise<Post.Mongo> => {
        const validator = yup
          .object()
          .shape({
            postId: yup.string().required().test({
              test: isObjectId,
              message: "Invalid post id",
            }),
            like: yup.bool().required(),
          })
          .required();

        validateArgs(validator, args);

        const { like, postId } = args;

        const postData = await db.posts.find(postId);
        if (!postData) {
          throw new NotFoundError("Post");
        }

        const newPostData = like
          ? db.posts.likePost(postId, user._id)
          : db.posts.unlikePost(postId, user._id);

        // Send Notification
        if (
          like &&
          !_.map(postData.likeIds, (item) => item.toString()).includes(
            user._id.toString()
          )
        ) {
          let notifyUsers = [postData.userId];
          if (postData.isCompany) {
            const company = await db.companies.find(postData.userId);
            notifyUsers = company ? company.memberIds : [];
          }

          db.notifications.create(user, "like-post", notifyUsers, {
            postId: postData._id,
          });
        }

        return newPostData;
      }
    ),

    likeComment: secureEndpoint(
      async (
        parentIgnored,
        args: { commentId: string; like: boolean },
        { db, user }
      ): Promise<Comment.Mongo> => {
        const validator = yup
          .object()
          .shape({
            commentId: yup.string().required().test({
              test: isObjectId,
              message: "Invalid comment id",
            }),
            like: yup.bool().required(),
          })
          .required();

        validateArgs(validator, args);

        const { like, commentId } = args;

        return like
          ? db.comments.likeComment(commentId, user._id)
          : db.comments.unlikeComment(commentId, user._id);
      }
    ),

    reportPost: secureEndpoint(
      async (
        parentIgnored,
        args: { report: ReportedPost },
        { db, user }
      ): Promise<boolean> => {
        const validator = yup
          .object()
          .shape({
            report: yup
              .object()
              .shape({
                postId: yup.string().required().test({
                  test: isObjectId,
                  message: "Invalid post id",
                }),
                comments: yup.string().required(),
                violations: yup
                  .array()
                  .of(
                    yup
                      .string()
                      .oneOf(
                        _.map(Object.values(PostViolationOptions), "value")
                      )
                      .required()
                  )
                  .min(1)
                  .required(),
              })
              .required(),
          })
          .required();

        validateArgs(validator, args);

        const { report } = args;
        const postData = await db.posts.find(report.postId);
        if (!postData) {
          throw new NotFoundError("Post");
        }

        await db.users.reportPost(report, user._id);
        await db.posts.logReport(report.postId, user._id);
        await PrometheusMailer.reportPost(report, postData, user);

        return true;
      }
    ),

    hidePost: secureEndpoint(
      async (
        parentIgnored,
        args: { postId: string; hide: boolean },
        { db, user }
      ): Promise<boolean> => {
        const validator = yup
          .object()
          .shape({
            postId: yup.string().required().test({
              test: isObjectId,
              message: "Invalid post id",
            }),
            hide: yup.bool().required(),
          })
          .required();

        validateArgs(validator, args);

        const { hide, postId } = args;

        const postData = await db.posts.find(postId);
        if (!postData) {
          throw new NotFoundError("Post");
        }

        return db.users.hidePost(hide, postId, user._id);
      }
    ),

    mutePost: secureEndpoint(
      async (
        parentIgnored,
        args: { postId: string; mute: boolean },
        { db, user }
      ): Promise<boolean> => {
        const validator = yup
          .object()
          .shape({
            postId: yup.string().required().test({
              test: isObjectId,
              message: "Invalid post id",
            }),
            mute: yup.bool().required(),
          })
          .required();

        validateArgs(validator, args);

        const { mute, postId } = args;

        const postData = await db.posts.find(postId);
        if (!postData) {
          throw new NotFoundError("Post");
        }

        return db.users.mutePost(mute, postId, user._id);
      }
    ),

    comment: secureEndpoint(
      async (
        parentIgnored,
        args: { comment: Comment.Input },
        { db, user }
      ): Promise<Comment.Mongo> => {
        const validator = yup
          .object()
          .shape({
            comment: yup
              .object()
              .shape({
                postId: yup.string().required().test({
                  test: isObjectId,
                  message: "Invalid post id",
                }),
                body: yup.string().required(),
                mentionIds: yup.array().of(
                  yup.string().test({
                    test: isObjectId,
                    message: "Invalid mention id",
                  })
                ),
                commentId: yup.string().test({
                  test: isObjectId,
                  message: "Invalid comment id",
                }),
              })
              .required(),
          })
          .required();

        validateArgs(validator, args);

        const { comment } = args;
        const postData = await db.posts.find(comment.postId);
        if (!postData) {
          throw new NotFoundError("Post");
        }

        const newComment = await db.comments.create(comment, user._id);

        // Send notification
        let notifyUsers = [postData.userId];
        if (postData.isCompany) {
          const company = await db.companies.find(postData.userId);
          notifyUsers = company ? company.memberIds : [];
        }
        db.notifications.create(user, "comment-post", notifyUsers, {
          postId: postData._id,
          commentId: newComment._id,
        });

        const mentionIds = newComment?.mentionIds ?? [];
        await Promise.all(
          mentionIds.map((mentionId) => {
            return db.notifications.create(
              user,
              "tagged-in-comment",
              [mentionId],
              {
                postId: postData._id,
                commentId: newComment._id,
              }
            );
          })
        );

        return newComment;
      }
    ),

    editComment: secureEndpoint(
      async (
        parentIgnored,
        args: { comment: Comment.Update },
        { db, user }
      ): Promise<Comment.Mongo> => {
        const validator = yup
          .object()
          .shape({
            comment: yup
              .object()
              .shape({
                _id: yup.string().required().test({
                  test: isObjectId,
                  message: "Invalid comment id",
                }),
                body: yup.string().required(),
                mentionIds: yup.array().of(
                  yup.string().test({
                    test: isObjectId,
                    message: "Invalid mention id",
                  })
                ),
              })
              .required(),
          })
          .required();

        validateArgs(validator, args);

        const { comment } = args;

        return db.comments.edit(comment, user._id);
      }
    ),

    deleteComment: secureEndpoint(
      async (
        parentIgnored,
        args: { commentId: string },
        { db, user }
      ): Promise<boolean> => {
        const validator = yup
          .object()
          .shape({
            commentId: yup.string().required().test({
              test: isObjectId,
              message: "Invalid comment id",
            }),
          })
          .required();

        validateArgs(validator, args);

        const { commentId } = args;

        return db.comments.delete(commentId, user._id);
      }
    ),

    /**
     * Provides a signed AWS S3 upload link that can be used for a one-time
     * client-side upload of a file to an S3 bucket.
     */
    uploadLink: secureEndpoint(
      async (
        parentIgnored,
        args: { localFilename: string; type: MediaType; id: string }
      ): Promise<RemoteUpload | null> => {
        const validator = yup
          .object()
          .shape({
            localFilename: yup.string().required(),
            type: yup.string().oneOf(["POST", "AVATAR", "BACKGROUND", "FUND"]),
            id: yup.string().required().test({
              test: isObjectId,
              message: "Invalid id",
            }),
          })
          .required();

        validateArgs(validator, args);

        const { localFilename, type, id } = args;

        const fileExt = localFilename
          .toLowerCase()
          .substring(localFilename.lastIndexOf(".") + 1);
        const uploadInfo = await getUploadUrl(
          fileExt,
          type.toLowerCase() as Lowercase<MediaType>,
          id
        );
        return uploadInfo;
      }
    ),

    watchFund: secureEndpoint(
      async (
        parentIgnored,
        args: { fundId: string; watch: boolean },
        { db, user }
      ): Promise<User.Mongo> => {
        const validator = yup
          .object()
          .shape({
            watch: yup.bool().required(),
            fundId: yup.string().required().test({
              test: isObjectId,
              message: "Invalid fund id",
            }),
          })
          .required();

        validateArgs(validator, args);

        const { fundId, watch } = args;

        const fund = await db.funds.find(fundId);

        if (!fund) {
          throw new NotFoundError("Fund");
        }

        // Check that the user has access to this fund if adding to watchlist
        if (compareAccreditation(user.accreditation, fund.level) < 0) {
          throw new UnprocessableEntityError("Unauthorized to watch fund");
        }

        const companyId = fund.companyId;

        const companyData = await db.companies.find(companyId);
        if (!companyData) {
          throw new NotFoundError("Company");
        }

        const followCompanyMembers = async (): Promise<void> => {
          for (const userId of companyData.memberIds) {
            await handleFollowUser({ db, user }, userId.toString(), true);
          }
        };

        if (watch) {
          try {
            await handleFollowCompany({ db, user }, companyId.toString(), true);
            await followCompanyMembers();
          } catch (e) {
            throw new InternalServerError(
              `Not able to add follower ${user._id}.`
            );
          }
        }

        return db.users.setOnWatchlist(watch, fundId, user._id);
      }
    ),

    followUser: secureEndpoint(
      async (
        parentIgnored,
        args: { follow: boolean; userId: string; asCompanyId?: string },
        { db, user }
      ): Promise<FollowUserResult> => {
        const validator = yup
          .object()
          .shape({
            follow: yup.bool().required(),
            userId: yup.string().required().test({
              test: isObjectId,
              message: "Invalid user id",
            }),
            asCompanyId: yup.string().test({
              test: isObjectId,
              message: "Invalid company id",
            }),
          })
          .required();

        validateArgs(validator, args);

        const { follow, userId, asCompanyId } = args;

        if (userId === user._id.toString()) {
          throw new UnprocessableEntityError("Invalid user.");
        }

        return handleFollowUser({ db, user }, userId, follow, asCompanyId);
      }
    ),

    followCompany: secureEndpoint(
      async (
        parentIgnored,
        args: { follow: boolean; companyId: string; asCompanyId?: string },
        { db, user }
      ): Promise<FollowCompanyResult> => {
        const validator = yup
          .object()
          .shape({
            follow: yup.bool().required(),
            companyId: yup.string().required().test({
              test: isObjectId,
              message: "Invalid company id",
            }),
            asCompanyId: yup.string().test({
              test: isObjectId,
              message: "Invalid company id",
            }),
          })
          .required();

        validateArgs(validator, args);

        const { follow, companyId, asCompanyId } = args;

        return handleFollowCompany(
          { db, user },
          companyId,
          follow,
          asCompanyId
        );
      }
    ),

    hideUser: secureEndpoint(
      async (
        parentIgnored,
        args: { hide: boolean; userId: string },
        { db, user }
      ): Promise<boolean> => {
        const validator = yup
          .object()
          .shape({
            hide: yup.bool().required(),
            userId: yup.string().required().test({
              test: isObjectId,
              message: "Invalid user id",
            }),
          })
          .required();

        validateArgs(validator, args);

        const { hide, userId } = args;

        const userData = await db.users.find({ _id: userId });
        if (!userData) {
          throw new NotFoundError();
        }

        return db.users.setHideUser(hide, userId, user._id);
      }
    ),

    readNotification: secureEndpoint(
      async (
        parentIgnored,
        args: { notificationId?: string },
        { db, user }
      ): Promise<boolean> => {
        const validator = yup
          .object()
          .shape({
            notificationId: yup.string().test({
              test: isObjectId,
              message: "Invalid notification id",
            }),
          })
          .required();

        validateArgs(validator, args);

        const { notificationId } = args;

        return db.notifications.read(user._id, notificationId);
      }
    ),

    seenNotification: secureEndpoint(
      async (
        _parentIgnored,
        args: { notificationId?: string },
        { db, user }
      ): Promise<boolean> => {
        const validator = yup
          .object()
          .shape({
            notificationId: yup.string().test({
              test: isObjectId,
              message: "Invalid notification id",
            }),
          })
          .required();

        validateArgs(validator, args);

        const { notificationId } = args;

        return db.notifications.seen(user._id, notificationId);
      }
    ),

    updateFcmToken: secureEndpoint(
      async (
        parentIgnored,
        args: { fcmToken: string },
        { db, user }
      ): Promise<boolean> => {
        const validator = yup
          .object()
          .shape({
            fcmToken: yup.string().required(),
          })
          .required();

        validateArgs(validator, args);

        const { fcmToken } = args;

        return db.users.updateFcmToken(user._id, fcmToken);
      }
    ),

    deleteAccount: secureEndpoint(
      async (parentIgnored, argsIgnored, { db, user }): Promise<boolean> => {
        return db.users.delete(user._id);
      }
    ),

    helpRequest: secureEndpoint(
      async (
        parentIgnored,
        args: { request: HelpRequest.Input },
        { db, user }
      ): Promise<boolean> => {
        const validator = yup
          .object({
            request: yup
              .object({
                type: yup
                  .string()
                  .oneOf(
                    Object.values(HelpRequestTypeOptions).map(
                      (option) => option.value
                    )
                  )
                  .required(),
                fundId: yup.string().required().test({
                  test: isObjectId,
                  message: "Invalid fund id",
                }),
                email: yup.string().email().when("type", {
                  is: "email",
                  then: yup.string().required(),
                }),
                phone: yup.string().when("type", {
                  is: "phone",
                  then: yup.string().required(),
                }),
                preferredTimeOfDay: yup
                  .string()
                  .oneOf(
                    Object.values(PreferredTimeOfDayOptions).map(
                      (option) => option.value
                    )
                  )
                  .when("type", {
                    is: "phone",
                    then: yup
                      .string()
                      .oneOf(
                        Object.values(PreferredTimeOfDayOptions).map(
                          (option) => option.value
                        )
                      )
                      .required(),
                  }),
                message: yup.string().notRequired(),
              })
              .required(),
          })
          .required();

        validateArgs(validator, args);

        const { request } = args;

        const fund = await db.funds.find(request.fundId);
        if (!fund) {
          throw new NotFoundError("Fund");
        }

        const requestData = await db.helpRequests.create(request, user._id);

        await PrometheusMailer.sendHelpRequest(user, requestData, fund);

        return true;
      }
    ),
  },
};

const partialSchema: PartialSchema = { schema, resolvers };
export default partialSchema;

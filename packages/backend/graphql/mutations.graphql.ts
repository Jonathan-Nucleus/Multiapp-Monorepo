import { gql } from "apollo-server";
import * as yup from "yup";
import _ from "lodash";
import { PrometheusMailer } from "../email";
import "yup-phone";

import {
  PartialSchema,
  ApolloServerContext,
  secureEndpoint,
} from "../lib/apollo-helper";
import {
  getAccessToken,
  getResetToken,
  decodeToken,
  AccessToken,
  ResetTokenPayload,
} from "../lib/tokens";
import { registerUser } from "../lib/get-stream";
import { getUploadUrl, RemoteUpload } from "../lib/s3-helper";
import {
  isObjectId,
  NotFoundError,
  UnprocessableEntityError,
  BadRequestError,
  validateArgs,
  InternalServerError,
} from "../lib/validate";

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
import type { Post } from "../schemas/post";
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
    likePost(like: Boolean!, postId: ID!): Post
    likeComment(like: Boolean!, commentId: ID!): Comment
    reportPost(report: ReportedPostInput!): Boolean
    hidePost(hide: Boolean!, postId: ID!): Boolean
    mutePost(mute: Boolean!, postId: ID!): Boolean
    comment(comment: CommentInput!): Comment
    editComment(comment: CommentUpdate!): Comment
    deleteComment(commentId: ID!): Boolean
    uploadLink(localFilename: String!, type: MediaType!): MediaUpload
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

    readNotification(notificationId: ID): Boolean
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
  }
`;

export type MediaUpload = RemoteUpload;
export type MediaType = "POST" | "AVATAR" | "BACKGROUND";

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
          stubUser.emailToken as string
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

        if (userData && questionnaire.class === "advisor") {
          await PrometheusMailer.sendFARequest(userData);
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
                body: yup.string(),
                media: yup.object().when("body", {
                  is: (body?: string) => body && body.length > 0,
                  then: yup
                    .object({
                      url: yup.string().required(),
                      aspectRatio: yup.number().required(),
                    })
                    .notRequired()
                    .default(undefined),
                  otherwise: yup
                    .object({
                      url: yup.string().required(),
                      aspectRatio: yup.number().required(),
                    })
                    .required(),
                }),
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

        const postData = await db.posts.create(post, user._id);
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
                body: yup.string(),
                media: yup.object({
                  url: yup.string().required(),
                  aspectRatio: yup.number().required(),
                }),
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

        const { post } = args;
        if (
          user._id.toString() !== post.userId &&
          !user.companyIds?.find(
            (companyId) => companyId.toString() === post.userId
          )
        ) {
          throw new BadRequestError("Not authorized");
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

        return db.posts.delete(postId, user._id);
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
          db.notifications.create(user, "like-post", postData.userId, {
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
        if (newComment) {
          db.notifications.create(user, "comment-post", postData.userId, {
            postId: postData._id,
            commentId: newComment._id,
          });
        }

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
        args: { localFilename: string; type: MediaType }
      ): Promise<RemoteUpload | null> => {
        const validator = yup
          .object()
          .shape({
            localFilename: yup.string().required(),
            type: yup.string().oneOf(["POST", "AVATAR", "BACKGROUND"]),
          })
          .required();

        validateArgs(validator, args);

        const { localFilename, type } = args;

        const fileExt = localFilename.substring(
          localFilename.lastIndexOf(".") + 1
        );
        const uploadInfo = await getUploadUrl(
          fileExt,
          type.toLowerCase() as Lowercase<MediaType>
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

        const updatedAccount = await db.users.setFollowingUser(
          follow,
          userId,
          user._id
        );
        const updatedUser = await db.users.setFollower(
          follow,
          user._id,
          userId
        );

        const followed = !!updatedAccount && !!updatedUser;

        if (!followed) {
          throw new InternalServerError("Not able to follow.");
        }

        // Send notification
        if (follow && followed) {
          db.notifications.create(user, "followed-by-user", userId);
        }

        return {
          account: updatedAccount,
          userAccount: updatedUser,
        };
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

        return {
          company: await db.companies.setFollower(follow, user._id, companyId),
          account: await db.users.setFollowingCompany(
            follow,
            companyId,
            user._id
          ),
        };
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

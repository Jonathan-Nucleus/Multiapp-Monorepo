import { gql } from "apollo-server-core";
import * as yup from "yup";

import {
  PartialSchema,
  ApolloServerContext,
  secureEndpoint,
} from "../apollo/apollo-helper";
import { getAccessToken, AccessToken } from "../utils/tokens";
import { getUploadUrl, RemoteUpload } from "backend/lib/s3-helper";
import { isObjectId, validateArgs } from "../apollo/validate";
import { AuthenticationError } from "apollo-server-errors";

import { Post } from "../schemas/post";
import { User } from "../schemas/user";

const schema = gql`
  type Mutation {
    login(email: String!, password: String!): String
    updateUser(userData: UpdateUserInput!): User

    deletePost(postId: ID!): Boolean!
    deleteComment(commentId: ID!): Boolean!
    disableComments(postId: ID!, disable: Boolean!): Post

    uploadLink(localFilename: String!, type: MediaType!, id: ID!): MediaUpload
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

const resolvers = {
  Mutation: {
    login: async (
      parentIgnored: User.Mongo,
      args: { email: string; password: string },
      { db }: ApolloServerContext
    ): Promise<AccessToken | null> => {
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
      const deserializedUser = await db.users.deserialize(user._id);

      if (!user.superUser) {
        throw new AuthenticationError("User is unauthorized.");
      }

      return getAccessToken(deserializedUser);
    },

    updateUser: secureEndpoint(
      async (
        parentIgnored,
        args: { userData: User.Update },
        { db }
      ): Promise<User.Mongo | null> => {
        const validator = yup
          .object({
            userData: yup
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

        const { userData } = args;
        return db.users.updateUser(userData);
      }
    ),

    deletePost: secureEndpoint(
      async (
        parentIgnored,
        args: { postId: string },
        { db }
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
        return db.posts.delete(postId);
      }
    ),

    deleteComment: secureEndpoint(
      async (
        parentIgnored,
        args: { commentId: string },
        { db }
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
        return db.comments.delete(commentId);
      }
    ),

    disableComments: secureEndpoint(
      async (
        parentIgnored,
        args: { postId: string; disable: boolean },
        { db }
      ): Promise<Post.Mongo | null> => {
        const validator = yup
          .object()
          .shape({
            postId: yup.string().required().test({
              test: isObjectId,
              message: "Invalid post id",
            }),
            disable: yup.bool().required(),
          })
          .required();

        validateArgs(validator, args);

        const { postId, disable } = args;

        return db.posts.disableComments(postId, disable);
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
      ): Promise<MediaUpload | null> => {
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
  },
};

const partialSchema: PartialSchema = { schema, resolvers };
export default partialSchema;

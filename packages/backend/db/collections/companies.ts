/**
 * Companies collection that serves as the model layer to store and retreive
 * individual companies from a MongoDB database.
 */

import { Collection } from "mongodb";
import { MongoId, toObjectId, toObjectIds } from "../../lib/mongo-helper";
import type { Company } from "../../schemas/company";
import { InternalServerError, NotFoundError } from "../../lib/apollo/validate";
import { createSearchStage } from "../../lib/utils";

/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
const createCompaniesCollection = (
  companiesCollection: Collection<Company.Mongo>
) => {
  return {
    /**
     * Find a company by the company id.
     *
     * @param id  The id of the compnay.
     *
     * @returns   The company or null if it was not found.
     */
    find: async (id: MongoId): Promise<Company.Mongo | null> =>
      companiesCollection.findOne({ _id: toObjectId(id) }),

    /**
     * Provides a list of all companies in the DB.
     *
     * @param ids An optional array of specific IDs to filter by.
     *
     * @returns   An array of matching Company objects.
     */
    findAll: async (ids?: MongoId[]): Promise<Company.Mongo[]> => {
      const query =
        ids !== undefined ? { _id: { $in: ids ? toObjectIds(ids) : ids } } : {};
      return companiesCollection.find(query).toArray();
    },

    fundCompanies: async (): Promise<Company.Mongo[]> =>
      companiesCollection.find({ "fundIds.0": { $exists: true } }).toArray(),

    /**
     * Updates a company's profile data.
     *
     * @param profile The updated profile data
     *
     * @returns   The updated user record.
     */
    updateProfile: async (
      profile: Company.ProfileInput
    ): Promise<Company.Mongo> => {
      const { _id, ...profileData } = profile;
      const keys = Object.keys(profileData);

      // Remove properties that are undefined
      keys.forEach(
        (key) => profileData[key] === undefined && delete profileData[key]
      );

      const company = await companiesCollection.findOneAndUpdate(
        { _id: toObjectId(_id) },
        { $set: { ...profileData, updatedAt: new Date() } },
        { returnDocument: "after" }
      );

      if (!company.ok) {
        throw new InternalServerError("Unable to update company profile");
      }
      if (!company.value) {
        throw new NotFoundError("Company");
      }

      return company.value as Company.Mongo;
    },

    /**
     * Set whether this company is following another user.
     *
     * @param follow        Whether or not this company is following another user.
     * @param followUserId  The id of the user to follow or unfollow.
     * @param companyId     The id of the current company.
     *
     * @returns   True if the follow state was successfully set, and false
     *            otherwise.
     */
    setFollowingUser: async (
      follow: boolean,
      followUserId: MongoId,
      companyId: MongoId
    ): Promise<Company.Mongo> => {
      const result = follow
        ? await companiesCollection.findOneAndUpdate(
            { _id: toObjectId(companyId) },
            { $addToSet: { followingIds: toObjectId(followUserId) } },
            { returnDocument: "after" }
          )
        : await companiesCollection.findOneAndUpdate(
            { _id: toObjectId(companyId) },
            { $pull: { followingIds: toObjectId(followUserId) } },
            { returnDocument: "after" }
          );

      const { value } = result;
      if (!result.ok || !value) {
        throw new InternalServerError(
          `Not able to follow user ${followUserId}.`
        );
      }

      return value as Company.Mongo;
    },

    /**
     * Set whether another user is following this company.
     *
     * @param follow        Whether or not another user is following this company.
     * @param followUserId  The id of the user that is following or unfollowing.
     * @param companyId     The id of the current company.
     *
     * @returns   True if the follow state was successfully set, and false
     *            otherwise.
     */
    setFollower: async (
      following: boolean,
      followerId: MongoId,
      companyId: MongoId
    ): Promise<Company.Mongo> => {
      const result = following
        ? await companiesCollection.findOneAndUpdate(
            { _id: toObjectId(companyId) },
            { $addToSet: { followerIds: toObjectId(followerId) } },
            { returnDocument: "after" }
          )
        : await companiesCollection.findOneAndUpdate(
            { _id: toObjectId(companyId) },
            { $pull: { followerIds: toObjectId(followerId) } },
            { returnDocument: "after" }
          );

      const { value } = result;
      if (!result.ok || !value) {
        throw new InternalServerError(
          `Not able to add follower ${followerId}.`
        );
      }

      return value as Company.Mongo;
    },

    /**
     * Set whether this company is following a company.
     *
     * @param follow            Whether or not this company is following another company.
     * @param followCompanyId   The id of the company to follow or unfollow.
     * @param companyId         The id of the current company.
     *
     * @returns   True if the follow state was successfully set, and false
     *            otherwise.
     */
    setFollowingCompany: async (
      follow: boolean,
      followCompanyId: MongoId,
      companyId: MongoId
    ): Promise<Company.Mongo> => {
      const result = follow
        ? await companiesCollection.findOneAndUpdate(
            { _id: toObjectId(companyId) },
            {
              $addToSet: { companyFollowingIds: toObjectId(followCompanyId) },
            },
            { returnDocument: "after" }
          )
        : await companiesCollection.findOneAndUpdate(
            { _id: toObjectId(companyId) },
            { $pull: { companyFollowingIds: toObjectId(followCompanyId) } },
            { returnDocument: "after" }
          );

      const { value } = result;
      if (!result.ok || !value) {
        throw new InternalServerError(
          `Not able to follow company ${followCompanyId}.`
        );
      }

      return value as Company.Mongo;
    },

    /**
     * Set whether this company is being followed by another company.
     *
     * @param follower            Whether or not this company is following another company.
     * @param followerCompanyId   The id of the company to follow or unfollow.
     * @param companyId           The id of the current company.
     *
     * @returns   True if the follow state was successfully set, and false
     *            otherwise.
     */
    setFollowerCompany: async (
      following: boolean,
      followerCompanyId: MongoId,
      companyId: MongoId
    ): Promise<Company.Mongo> => {
      const result = following
        ? await companiesCollection.findOneAndUpdate(
            { _id: toObjectId(companyId) },
            {
              $addToSet: {
                companyFollowerIds: toObjectId(followerCompanyId),
              },
            },
            { returnDocument: "after" }
          )
        : await companiesCollection.findOneAndUpdate(
            { _id: toObjectId(companyId) },
            { $pull: { companyFollowerIds: toObjectId(followerCompanyId) } },
            { returnDocument: "after" }
          );

      const { value } = result;
      if (!result.ok || !value) {
        throw new InternalServerError(
          `Not able to add follower company ${followerCompanyId}.`
        );
      }

      return value as Company.Mongo;
    },

    /**
     * Provides a list of companies searched by keyword.
     *
     * @param search  Search keyword.
     * @param limit   Optional limit for search result. Defaults to 10.
     *
     * @returns The list of companies.
     */
    findByKeyword: async (
      search = "",
      limit = 10
    ): Promise<Company.Mongo[]> => {
      const stage = createSearchStage("name", search);
      if (!stage) {
        return [];
      }

      const companies = (await companiesCollection
        .aggregate([
          {
            $search: { ...stage },
          },
          {
            $limit: limit,
          },
        ])
        .toArray()) as Company.Mongo[];

      return companies;
    },
  };
};

export default createCompaniesCollection;

import { Db, ObjectId } from "mongodb";
import { faker } from "@faker-js/faker";

import { randomInt, randomArray } from "./helpers";
import { Company } from "../../schemas/company";
import { User } from "../../schemas/user";

// The name of the mongo collection
const COLLECTION = "companies";

// The number of users to seed
const NUM_COMPANIES = 7;
const MAX_MEMBERS_PER_COMPANY = 3;

export default async function (
  db: Db,
  userIds: ObjectId[]
): Promise<ObjectId[]> {
  // Drop the collection if it exists before (re)creating it
  await db
    .collection(COLLECTION)
    .drop()
    .catch(() => {});

  // Generate company data
  const companies = [...Array(NUM_COMPANIES)].map<Company.Mongo>(() => ({
    _id: new ObjectId(),
    name: faker.company.companyName(),
    website: faker.internet.url(),
    memberIds: randomArray(
      0,
      userIds.length - 1,
      randomInt(1, MAX_MEMBERS_PER_COMPANY)
    ).map((index) => userIds[index]),
  }));

  const companiesByUser = companies.reduce<{ [key: string]: ObjectId[] }>(
    (acc, company) => {
      company.memberIds.map((member) => {
        if (typeof acc[member.toString()] === "undefined") {
          acc[member.toString()] = [];
        }

        acc[member.toString()].push(company._id);
      });

      return acc;
    },
    {}
  );

  try {
    const companiesCollection = await db.createCollection<Company.Mongo>(
      COLLECTION
    );
    const usersCollection = db.collection<User.Mongo>("users");

    await companiesCollection.insertMany(companies);
    await Promise.all(
      Object.keys(companiesByUser).map((userId) => {
        return usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $set: { companyIds: companiesByUser[userId] } }
        );
      })
    );

    return companies.map((company) => company._id);
  } catch (err) {
    console.log(`Error seeding "${COLLECTION}" collection: `, err);
  }

  return [];
}

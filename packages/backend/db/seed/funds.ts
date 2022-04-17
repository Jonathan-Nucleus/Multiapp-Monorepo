import { Db, ObjectId } from "mongodb";
import { faker } from "@faker-js/faker";

import { randomInt, randomArray } from "./helpers";
import { Company } from "../../schemas/company";
import { Fund } from "../../schemas/fund";
import { User, AccreditationOptions } from "../../schemas/user";

// The name of the mongo collection
const COLLECTION = "funds";

// The number of funds to seed per company
const MAX_FUNDS_PER_COMPANY = 4;
const MAX_TEAM_MEMBERS_PER_FUND = 6;
const MAX_TAGS_PER_FUND = 5;
const NUM_HIGHLIGHTS = 4;

const accreditationValues = Object.keys(AccreditationOptions).map(
  (key) => AccreditationOptions[key].value
);

export default async function (
  db: Db,
  userIds: ObjectId[],
  companyIds: ObjectId[]
): Promise<ObjectId[]> {
  // Drop the collection if it exists before (re)creating it
  await db
    .collection(COLLECTION)
    .drop()
    .catch(() => {});

  // Generate comment data
  const managers: Record<string, ObjectId[]> = {};
  const fundsByCompany = companyIds.map<Fund.Mongo[]>((companyId) => {
    return [...Array(randomInt(0, MAX_FUNDS_PER_COMPANY))].map<Fund.Mongo>(
      () => {
        const fundId = new ObjectId();
        const fundManager = userIds[randomInt(0, userIds.length - 1)];
        const managerId = fundManager.toString();
        if (!managers[managerId]) {
          managers[managerId] = [];
        }

        managers[managerId].push(fundId);
        return {
          _id: fundId,
          name: `${faker.commerce.product()} Fund`,
          level:
            accreditationValues[randomInt(1, accreditationValues.length - 1)],
          managerId: fundManager,
          companyId: companyIds[randomInt(0, companyIds.length - 1)],
          status: "open",
          background: {
            url: "aefca1e5-7378-45bf-81cf-89f7f88366f5.png",
            width: 1000,
            height: 521,
            x: 0,
            y: 0,
            scale: 1,
          },
          highlights: [...Array(4)].map(() => faker.lorem.sentence()),
          overview: faker.lorem.paragraph(8),
          teamIds: Array.from(
            new Set(
              randomArray(
                0,
                userIds.length - 1,
                randomInt(0, MAX_TEAM_MEMBERS_PER_FUND)
              )
            )
          ).map((index) => userIds[index]),
          tags: [...Array(randomInt(0, MAX_TAGS_PER_FUND))].map(() =>
            faker.lorem.word()
          ),
        };
      }
    );
  });
  const funds = fundsByCompany.flat();

  try {
    const fundsCollection = await db.createCollection<Fund.Mongo>(COLLECTION);
    const companiesCollection = db.collection<Company.Mongo>("companies");
    const usersCollection = db.collection<Company.Mongo>("users");

    await fundsCollection.insertMany(funds);
    await Promise.all(
      fundsByCompany.map((companyFunds, index) => {
        return companiesCollection.updateOne(
          { _id: companyIds[index] },
          { $set: { fundIds: companyFunds.map((fund) => fund._id) } }
        );
      })
    );

    // Update all fund manager records
    await Promise.all(
      Object.keys(managers).map((managerId) => {
        return usersCollection.updateOne(
          { _id: new ObjectId(managerId) },
          { $set: { managedFundsIds: managers[managerId] } }
        );
      })
    );

    return funds.map((fund) => fund._id);
  } catch (err) {
    console.log(`Error seeding "${COLLECTION}" collection: `, err);
  }

  return [];
}

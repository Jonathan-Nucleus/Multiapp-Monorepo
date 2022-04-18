import { Db, ObjectId } from "mongodb";
import { faker } from "@faker-js/faker";

import { randomInt, randomArray } from "./helpers";
import { Company } from "../../schemas/company";
import { User } from "../../schemas/user";

// The name of the mongo collection
const COLLECTION = "companies";

// The number of users to seed
const NUM_COMPANIES = 15;
const MAX_MEMBERS_PER_COMPANY = 7;

const avatars = [
  "8debfc0c-8da0-4508-9124-2916e708e254.png",
  "e962fffa-bff5-4917-b1ef-b24b30bbf1f1.png",
  "a2f0db24-3b6f-4a70-9e37-b772107b6a28.png",
  "f8121cc2-5a70-498d-b3cb-9a00418b5841.png",
  "b1de5708-a5f7-48f6-a14b-9584e5c0a37c.png",
  "f4a750f9-101f-4b9d-a4d2-9f52393107b6.png",
  "5efc3ddf-0380-4952-b092-508814b6873c.jpg",
  "f8de245a-3bf3-4a4b-92de-cdf30af88b13.jpg",
  "0e205f87-1586-4b1f-ab28-20d05adf43dc.jpg",
];

const backgrounds = [
  "6d0960eb-fc83-499b-a5e3-93b30939faf2.jpg",
  "a7d061b2-900b-4305-b233-904c7e4ad7d5.jpg",
  "cd4720bc-14f2-40e3-85ea-73e6fde430f9.jpg",
  "fdd02869-1286-4c9d-8038-489461ee8082.jpg",
  "a2e8381f-9333-4541-a6ab-c5cb9e5a40cb.jpg",
  "a28036bc-1a91-4014-ae34-ecd260c2e2fc.jpg",
  "9e3f6e58-3560-40f9-90c2-1d996efe6255.jpg",
  "0d7acb26-c6c3-4967-a066-751675d7603f.jpg",
  "ff5c115b-ddd5-49b2-b096-f88e65e44893.jpg",
  "f38b60f9-783a-4317-beed-d1becfb0a590.jpg",
  "d5fa5b2a-fd2c-4143-8612-5d3030ad9b0c.jpg",
];

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
  const companies = [...Array(NUM_COMPANIES)].map<Company.Mongo>(
    (ignored, index) => ({
      _id: new ObjectId(),
      name: faker.company.companyName(),
      website: faker.internet.url(),
      memberIds: randomArray(
        0,
        userIds.length - 1,
        randomInt(3, MAX_MEMBERS_PER_COMPANY)
      ).map((index) => userIds[index]),
      avatar: avatars[index % avatars.length],
      background: {
        url: backgrounds[index % backgrounds.length],
        x: 0,
        y: 0,
        width: 390,
        height: 65,
        scale: 1,
      },
      tagline: faker.lorem.sentence(),
      overview: faker.lorem.paragraph(),
    })
  );

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

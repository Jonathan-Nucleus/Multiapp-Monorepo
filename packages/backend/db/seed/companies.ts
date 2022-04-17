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
  "00664562-0251-4296-aee5-b2091667c088.jpg",
  "3aee8b1a-5fc5-4640-877b-681a3906cd12.jpg",
  "00fe6b0b-f8e4-4860-97a4-60af8d122a07.jpg",
  "8d283ba2-e153-4ab1-acdb-d24b81c0ee15.jpg",
  "fbaac7ff-0b53-4f89-829c-addaf07a6c40.jpg",
  "fc0e4ccb-6c03-4592-88b7-c1b371d19970.jpg",
  "2065f06b-7f07-48f5-87d6-cf5e34950ff1.jpg",
  "15a9e96c-cd80-4215-9b78-3c1d7d33478c.jpg",
  "fd131d1c-316e-4384-aa98-4a34af62984e.jpg",
  "85e76d51-2432-48a6-9cc2-865c75b4f810.jpg",
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
        randomInt(1, MAX_MEMBERS_PER_COMPANY)
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

import { Db, ObjectId } from "mongodb";
import { faker } from "@faker-js/faker";

import { User } from "backend/schemas/user";
import { generateSalt, hashPassword } from "backend/db/collections/users";

// The name of the mongo collection
const COLLECTION = "users";

// The number of users to seed
const NUM_USERS = 10;

export default async function (db: Db): Promise<ObjectId[]> {
  // Drop the collection if it exists before (re)creating it
  await db
    .collection<User.Mongo>(COLLECTION)
    .drop()
    .catch(() => {});

  // Generate user data
  const users = [...Array(NUM_USERS)].map<User.Mongo>(() => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const salt = generateSalt();

    return {
      _id: new ObjectId(),
      firstName,
      lastName,
      email: faker.internet.email(firstName, lastName),
      salt,
      password: hashPassword("test-pass", salt),
      role: "user",
      accreditation: "none",
      website: faker.internet.url(),
    };
  });

  try {
    const usersCollection = await db.createCollection<User.Mongo>(COLLECTION);
    await usersCollection.insertMany(users);

    return users.map((user) => user._id);
  } catch (err) {
    console.log(`Error seeding "${COLLECTION}" collection: `, err);
  }

  return [];
}

import { Db, ObjectId } from "mongodb";
import { faker } from "@faker-js/faker";

import { User } from "backend/schemas/user";
import { generateSalt, hashPassword } from "backend/db/collections/users";

// The name of the mongo collection
const COLLECTION = "users";

// The number of users to seed
const NUM_USERS = 10;

const avatars = [
  "7d9d80b7-90dd-42e8-b3e2-a7a37d6cd1ba.png",
  "614f6093-f67e-40f4-84ea-32c3bacb44f4.png",
  "58ec51e9-57a0-4d86-97d2-3d42e8f823ba.png",
  "ab3efdcb-5549-4962-bf5c-511a4d11ac18.png",
  "5b2809ef-cba3-4dca-bb2e-64861926df61.png",
  "ae31d937-d8a6-4942-bbd4-26ac4d7e0f6d.png",
  "08dd3b2d-d928-4764-9e32-b510f5a90496.png",
  "96975b8f-49ee-45a9-8bfd-404df42197a1.png",
  "ff5642fc-8a16-4ab0-b7c8-4be8a984e34b.png",
  "0d99b6b8-b857-40d6-9001-47fdc1f92b4f.png",
];

export default async function (db: Db): Promise<ObjectId[]> {
  // Drop the collection if it exists before (re)creating it
  await db
    .collection<User.Mongo>(COLLECTION)
    .drop()
    .catch(() => {});

  // Generate user data
  const users = [...Array(NUM_USERS)].map<User.Mongo>((valIgnored, index) => {
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
      avatar: avatars[index % avatars.length],
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

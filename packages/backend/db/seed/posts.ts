import { Db, ObjectId } from "mongodb";
import { faker } from "@faker-js/faker";

import { randomInt, randomArray } from "./helpers";
import {
  Post,
  AudienceOptions,
  PostCategoryOptions,
} from "backend/schemas/post";

// The name of the mongo collection
const COLLECTION = "posts";

// The number of users to seed
const MAX_POSTS = 5;
const MAX_CATEGORIES_PER_POST = 5;
const MAX_MENTIONS_PER_POST = 2;

const audienceValues = Object.keys(AudienceOptions).map(
  (key) => AudienceOptions[key]
);
const categoryValues = Object.keys(PostCategoryOptions).map(
  (key) => PostCategoryOptions[key]
);

export default async function (
  db: Db,
  userIds: ObjectId[]
): Promise<ObjectId[]> {
  // Drop the collection if it exists before (re)creating it
  await db
    .collection<Post.Mongo>(COLLECTION)
    .drop()
    .catch(() => {});

  // Generate post data
  const posts = userIds
    .map<Post.Mongo[]>((userId) => {
      return [...Array(randomInt(1, MAX_POSTS))].map<Post.Mongo>(() => ({
        _id: new ObjectId(),
        userId,
        visible: true,
        body: faker.lorem.paragraph(),
        audience: audienceValues[randomInt(0, audienceValues.length - 1)],
        categories: Array.from(
          new Set(
            randomArray(
              0,
              categoryValues.length - 1,
              randomInt(0, MAX_CATEGORIES_PER_POST)
            )
          )
        ).map((index) => categoryValues[index]),
        mentionIds: Array.from(
          new Set(
            randomArray(
              0,
              userIds.length - 1,
              randomInt(0, MAX_MENTIONS_PER_POST)
            )
          )
        ).map((index) => userIds[index]),
      }));
    })
    .flat();

  try {
    const postsCollection = await db.createCollection<Post.Mongo>(COLLECTION);
    await postsCollection.insertMany(posts);

    return posts.map((post) => post._id);
  } catch (err) {
    console.log(`Error seeding "${COLLECTION}"" collection: `, err);
  }

  return [];
}

import { Db, ObjectId } from "mongodb";
import { faker } from "@faker-js/faker";

import { randomInt, randomArray } from "./helpers";
import { Post, AudienceOptions, PostCategoryOptions } from "../../schemas/post";
import { User } from "../../schemas/user";

// The name of the mongo collection
const COLLECTION = "posts";

// The number of users to seed
export const MAX_POSTS = 5;
export const MAX_CATEGORIES_PER_POST = 5;
export const MAX_MENTIONS_PER_POST = 2;

export const audienceValues = Object.keys(AudienceOptions).map(
  (key) => AudienceOptions[key]
);
export const categoryValues = Object.keys(PostCategoryOptions).map(
  (key) => PostCategoryOptions[key].value
);

const stockImages = [
  "e70fd9fd-9a60-48b0-8f77-e1009585dde7.png",
  "e9978e62-5e23-4800-9485-492cddb7fae6.jpg",
  "0d21bdea-727b-4407-8341-8e592fa2a1cd.jpg",
  "c9ca1184-bd6d-43fe-98c9-018b5bfa2aad.jpg",
  "8c2fc178-5637-4199-8718-fdbefb0162a9.jpg",
  "917f9684-d655-44cc-98ff-b65e420395a4.jpg",
  "df64375a-ab17-49d9-8cdc-e5e6344fd35a.jpg",
  "28baa4ab-d70a-493b-8609-82966e2eb49a.jpg",
  "836fc07b-1412-4106-9c06-90c4a5883c10.jpg",
  "6659a517-b9b3-4b00-87fd-e98dadc73f8a.jpg",
  "fc51fdcc-a91e-4011-9f67-4e86c1595519.jpg",
  "895b9eaa-a135-4492-acad-5cfd9495e88a.jpg",
  "98908bf5-3b33-42a9-9199-f96baf0575ee.jpg",
  "c46e727a-6c62-4cba-8d77-8d29394b09f8.jpg",
  "a7c04b79-a082-449b-bbd5-f567d4136203.jpg",
];

export default async function (
  db: Db,
  userIds: ObjectId[]
): Promise<ObjectId[]> {
  // Drop the collection if it exists before (re)creating it
  await db.collection<Post.Mongo>(COLLECTION).drop().catch(console.log);

  // Generate post data
  const postsByUser: Record<string, ObjectId[]> = {};
  const posts = userIds
    .map<Post.Mongo[]>((userId) => {
      const userIdKey = userId.toString();

      if (!postsByUser[userIdKey]) {
        postsByUser[userIdKey] = [];
      }

      return [...Array(randomInt(1, MAX_POSTS))].map<Post.Mongo>(() => {
        const postId = new ObjectId();
        postsByUser[userIdKey].push(postId);

        return {
          _id: postId,
          userId,
          visible: true,
          isCompany: false,
          body: faker.lorem.paragraph(),
          mediaUrl: stockImages[randomInt(0, stockImages.length - 1)],
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
        };
      });
    })
    .flat();

  try {
    const postsCollection = await db.createCollection<Post.Mongo>(COLLECTION);
    await postsCollection.insertMany(posts);

    // Update all user records
    const usersCollection = db.collection<User.Mongo>("users");
    await Promise.all(
      Object.keys(postsByUser).map((userId) => {
        return usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $set: { postIds: postsByUser[userId] } }
        );
      })
    );

    return posts.map((post) => post._id);
  } catch (err) {
    console.log(`Error seeding "${COLLECTION}"" collection: `, err);
  }

  return [];
}

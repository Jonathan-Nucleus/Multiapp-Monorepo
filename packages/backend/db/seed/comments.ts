import { Db, ObjectId } from "mongodb";
import { faker } from "@faker-js/faker";

import { randomInt } from "./helpers";
import { Comment } from "backend/schemas/comment";

// The name of the mongo collection
const COLLECTION = "comments";

// The number of users to seed
const MAX_COMMENTS = 3;

export default async function (
  db: Db,
  userIds: ObjectId[],
  postIds: ObjectId[]
): Promise<ObjectId[]> {
  // Drop the collection if it exists before (re)creating it
  await db
    .collection(COLLECTION)
    .drop()
    .catch(() => {});

  // Generate comment data
  const comments = userIds
    .map<Comment.Mongo[]>((userId) => {
      return [...Array(randomInt(0, MAX_COMMENTS))].map<Comment.Mongo>(() => ({
        _id: new ObjectId(),
        userId,
        postId: postIds[randomInt(0, postIds.length - 1)],
        body: faker.lorem.paragraph(),
      }));
    })
    .flat();

  try {
    const commentsCollection = await db.createCollection<Comment.Mongo>(
      COLLECTION
    );
    await commentsCollection.insertMany(comments);

    return comments.map((comment) => comment._id);
  } catch (err) {
    console.log(`Error seeding "${COLLECTION}" collection: `, err);
  }

  return [];
}

import { Db, ObjectId } from "mongodb";
import { faker } from "@faker-js/faker";

import { randomInt } from "./helpers";
import { Comment } from "../../schemas/comment";
import { Post } from "../../schemas/post";

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
  await db.collection(COLLECTION).drop().catch(console.log);

  // Generate comment data
  const commentsByPost: Record<string, ObjectId[]> = {};
  const comments = userIds
    .map<Comment.Mongo[]>((userId) => {
      return [...Array(randomInt(0, MAX_COMMENTS))].map<Comment.Mongo>(() => {
        const commentId = new ObjectId();
        const postId = postIds[randomInt(0, postIds.length - 1)];
        const postKey = postId.toString();

        if (!commentsByPost[postKey]) {
          commentsByPost[postKey] = [];
        }

        commentsByPost[postKey].push(commentId);

        return {
          _id: commentId,
          userId,
          postId,
          body: faker.lorem.paragraph(),
        };
      });
    })
    .flat();

  try {
    const commentsCollection = await db.createCollection<Comment.Mongo>(
      COLLECTION
    );
    await commentsCollection.insertMany(comments);

    // Update all user records
    const postsCollection = db.collection<Post.Mongo>("posts");
    await Promise.all(
      Object.keys(commentsByPost).map((postId) => {
        return postsCollection.updateOne(
          { _id: new ObjectId(postId) },
          { $set: { commentIds: commentsByPost[postId] } }
        );
      })
    );

    return comments.map((comment) => comment._id);
  } catch (err) {
    console.log(`Error seeding "${COLLECTION}" collection: `, err);
  }

  return [];
}

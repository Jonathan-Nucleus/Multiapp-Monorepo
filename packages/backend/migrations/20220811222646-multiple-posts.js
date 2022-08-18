module.exports = {
  async up(db) {
    await db
      .collection("posts")
      .updateMany(
        { media: { $exists: true } },
        [{ $set: { attachments: ["$media"] } }],
        { multi: true }
      );
  },

  async down(db) {
    await db
      .collection("posts")
      .updateMany(
        { media: { $exists: true } },
        [{ $set: { media: { $first: "$media" } } }],
        { multi: true }
      );
  },
};

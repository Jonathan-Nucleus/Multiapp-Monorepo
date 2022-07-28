/**
 * This migration introduces a new field to the notifications collection,
 * `isRead`. This field store whether the notification has actually be read
 * (clicked on), to separate this status from whether or not the user has
 * navigated to the notifications screen and seen the notification (`isNew`).
 */

module.exports = {
  async up(db) {
    // Add isRead property all all records that don't already have it set
    await db.collection("notifications").updateMany(
      { isRead: { $exists: false } },
      { $set: { isRead: false } }
    )
  },

  async down(db) {
    // Remove isRead property from all records
    await db.collection("notifications").updateMany(
      {},
      { $unset: { isRead: "" } }
    )
  }
};

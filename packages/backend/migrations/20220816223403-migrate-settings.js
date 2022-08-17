module.exports = {
  async up(db) {
    await db.collection("users").updateMany(
      {},
      {
        $set: {
          "settings.tagging": true,
          "settings.messaging": true,
          "settings.emailUnreadMessage": false,
          "settings.notifications.commentLike": "sms",
          "settings.notifications.messageReceived": "sms",
          "settings.notifications.postComment": "sms",
          "settings.notifications.postCreate": "sms",
          "settings.notifications.postLike": "sms",
          "settings.notifications.tagCreate": "sms",
        },
      }
    );
  },

  async down() {
    // N/A as these new fields are required on the User schema
  },
};

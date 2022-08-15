module.exports = {
  async up(db) {
    await db.collection("posts").updateMany({}, [
      {
        $addFields: {
          likeCount: {
            $cond: {
              if: { $not: "$likeIds" },
              then: 0,
              else: { $size: "$likeIds" },
            },
          },
          commentCount: {
            $cond: {
              if: { $not: "$commentIds" },
              then: 0,
              else: { $size: "$commentIds" },
            },
          },
          shareCount: {
            $cond: {
              if: { $not: "$shareIds" },
              then: 0,
              else: { $size: "$shareIds" },
            },
          },
        },
      },
    ]);
    await db.collection("comments").updateMany({}, [
      {
        $addFields: {
          likeCount: {
            $cond: {
              if: { $not: "$likeIds" },
              then: 0,
              else: { $size: "$likeIds" },
            },
          },
        },
      },
    ]);
    await db.collection("users").updateMany({}, [
      {
        $addFields: {
          postCount: {
            $cond: {
              if: { $not: "$postIds" },
              then: 0,
              else: { $size: "$postIds" },
            },
          },
          followerCount: {
            $cond: {
              if: { $not: "$followerIds" },
              then: 0,
              else: { $size: "$followerIds" },
            },
          },
          followingCount: {
            $cond: {
              if: { $not: "$followingIds" },
              then: 0,
              else: { $size: "$followingIds" },
            },
          },
          companyFollowingCount: {
            $cond: {
              if: { $not: "$companyFollowingIds" },
              then: 0,
              else: { $size: "$companyFollowingIds" },
            },
          },
          companyFollowerCount: {
            $cond: {
              if: { $not: "$companyFollowerIds" },
              then: 0,
              else: { $size: "$companyFollowerIds" },
            },
          },
        },
      },
    ]);
    await db.collection("companies").updateMany({}, [
      {
        $addFields: {
          postCount: {
            $cond: {
              if: { $not: "$postIds" },
              then: 0,
              else: { $size: "$postIds" },
            },
          },
          followerCount: {
            $cond: {
              if: { $not: "$followerIds" },
              then: 0,
              else: { $size: "$followerIds" },
            },
          },
          followingCount: {
            $cond: {
              if: { $not: "$followingIds" },
              then: 0,
              else: { $size: "$followingIds" },
            },
          },
          companyFollowingCount: {
            $cond: {
              if: { $not: "$companyFollowingIds" },
              then: 0,
              else: { $size: "$companyFollowingIds" },
            },
          },
          companyFollowerCount: {
            $cond: {
              if: { $not: "$companyFollowerIds" },
              then: 0,
              else: { $size: "$companyFollowerIds" },
            },
          },
        },
      },
    ]);
  },

  async down(db) {
    await db.collection("users").updateMany(
      {},
      {
        $unset: {
          postCount: "",
          followerCount: "",
          followingCount: "",
          companyFollowerCount: "",
          companyFollowingCount: "",
        },
      }
    );
    await db.collection("companies").updateMany(
      {},
      {
        $unset: {
          postCount: "",
          followerCount: "",
          followingCount: "",
          companyFollowerCount: "",
          companyFollowingCount: "",
        },
      }
    );
    await db.collection("posts").updateMany(
      {},
      {
        $unset: {
          likeCount: "",
          commentCount: "",
          shareCount: "",
        },
      }
    );
    await db
      .collection("comments")
      .updateMany({}, { $unset: { likeCount: "" } });
  },
};

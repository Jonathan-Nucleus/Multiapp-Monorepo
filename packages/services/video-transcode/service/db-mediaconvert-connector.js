const mongoDbURI = process.env.MONGODB_URI;
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

let dbMediaConvertConnector = {
    update: async (req, res, next) => {
        const status = req.body.status;
        const postId = req.body.postId;

        try {
            MongoClient.connect(mongoDbURI, async (err, client) => {
                if (err) console.error(err);

                const path = mongoDbURI.split("/").pop();
                const dbName = path?.split("?").shift();
                const db = client.db(dbName);

                const result = await db.collection("posts").updateOne({ _id: new ObjectId(postId) }, {
                    $set: {
                        "media.status": status
                    }
                });

                console.log(
                    `${result.matchedCount} document(s) matched the ID ${postId}, updated ${result.modifiedCount} document(s) to status ${status}`,
                );
            });
        }
        catch (e) {
            console.error(e);
        }
        res.send({});
    }
};

module.exports = dbMediaConvertConnector;
const axios = require("axios").default;
const jwt = require("jsonwebtoken");
const postIdIndex = 3;
const requiredEnvVariables = ["BACKEND_URL", "JWT_SECRET"];
const AWS = require("aws-sdk");
const configurationSanityCheck = function () {
  for (let envVariableIdx in requiredEnvVariables) {
    if (!(requiredEnvVariables[envVariableIdx] in process.env)) {
      throw new Error(
        `Service not configured properly, please provide ${requiredEnvVariables[envVariableIdx]}`
      );
    }
  }
};

exports.handler = async (event) => {
  configurationSanityCheck();

  console.log("event: ", JSON.stringify(event, null, 2));
  const records = event["Records"];

  let recordIdx = 0;
  const keyPath = decodeURIComponent(records[recordIdx]["s3"]["object"]["key"]);
  const keyPathParts = keyPath.split("/");
  const filename = keyPathParts.slice(-1)[0];
  const postId = keyPathParts[postIdIndex];
  const API_URL = process.env.BACKEND_URL;
  const JWT_SECRET = process.env.JWT_SECRET;

  const fileExtension = keyPathParts
    .slice(-1)[0]
    .split(".")
    .slice(-1)[0]
    .toLowerCase();

  if (["mp4", "mov", "avi"].includes(fileExtension)) {
    const payload = {
      postId: postId,
      mediaUrl: filename,
    };
    const token = jwt.sign(payload, JWT_SECRET);
    try {
      const res = await axios.post(API_URL, {
        query: `
          mutation UpdatePostMedia($token: String!) {
            updatePostMedia(token: $token)
          }
        `,
        variables: {
          token: token,
        },
      });
      if (res.status == 200) {
        console.log(res);
      } else {
        console.error(res);
      }
    } catch (e) {
      console.error(e);
    }
  }

  return {
    status: 200,
  };
};

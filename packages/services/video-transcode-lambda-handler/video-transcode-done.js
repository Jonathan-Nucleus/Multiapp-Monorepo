const axios = require("axios").default;
const jwt = require("jsonwebtoken");

const requiredEnvVariables = ["BACKEND_URL", "JWT_SECRET"];
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
  console.log("event: ", JSON.stringify(event, null, 2));

  configurationSanityCheck();

  const keyPath = decodeURIComponent(event["detail"]["object"]["key"]);
  const API_URL = process.env.BACKEND_URL;
  const JWT_SECRET = process.env.JWT_SECRET;

  // Only send post update request if the media file matches the path
  // posts/{userId}/{postId}/{filename} and has a valid filename extension of
  // mp4, mov, or avi.
  const validPath = new RegExp(
    "posts/[a-z0-9]{24}/([a-z0-9]{24})/([\\w\\-. ]+.(?:mp4|mov|avi))",
    "i"
  );

  const matchResult = keyPath.match(validPath);
  if (matchResult !== null) {
    const postId = matchResult[1];
    const filename = matchResult[2];
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
  } else {
    console.log("Invalid key path for post update:", keyPath);
  }

  return {
    status: 200,
  };
};

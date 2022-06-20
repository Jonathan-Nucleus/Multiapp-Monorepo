const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const AWS = require("aws-sdk");

const requiredEnvVariables = ["MEDIA_CONVERT_ROLE_ARN", "AWS_DEFAULT_REGION"];

const configurationSanityCheck = function () {
  for (let envVariableIdx in requiredEnvVariables) {
    if (!(requiredEnvVariables[envVariableIdx] in process.env)) {
      throw new Error(
        `Service not configured properly, please provide ${requiredEnvVariables[envVariableIdx]}`
      );
    }
  }
};

AWS.config.update({ region: process.env.AWS_DEFAULT_REGION });
const mediaConvert = new AWS.MediaConvert({ apiVersion: "2017-08-29" });
const endpointMCparams = {
  MaxResults: 0,
};

const updateOutputSettings = function (jobSettings, destinationS3) {
  for (let outputGroup in jobSettings["OutputGroups"]) {
    console.log(
      `outputGroup['OutputGroupSettings']['Type'] == ${jobSettings["OutputGroups"][outputGroup]["OutputGroupSettings"]["Type"]}`
    );
    switch (
      jobSettings["OutputGroups"][outputGroup]["OutputGroupSettings"]["Type"]
    ) {
      case "FILE_GROUP_SETTINGS":
        jobSettings["OutputGroups"][outputGroup]["OutputGroupSettings"][
          "FileGroupSettings"
        ]["Destination"] = destinationS3;
        break;
      case "HLS_GROUP_SETTINGS":
        jobSettings["OutputGroups"][outputGroup]["OutputGroupSettings"][
          "HlsGroupSettings"
        ]["Destination"] = destinationS3;
        break;
      case "DASH_ISO_GROUP_SETTINGS":
        jobSettings["OutputGroups"][outputGroup]["OutputGroupSettings"][
          "DashIsoGroupSettings"
        ]["Destination"] = destinationS3;
        break;
      case "MS_SMOOTH_GROUP_SETTINGS":
        jobSettings["OutputGroups"][outputGroup]["OutputGroupSettings"][
          "MsSmoothGroupSettings"
        ]["Destination"] = destinationS3;
        break;
      case "CMAF_GROUP_SETTINGS":
        jobSettings["OutputGroups"][outputGroup]["OutputGroupSettings"][
          "CmafGroupSettings"
        ]["Destination"] = destinationS3;
        break;
      default:
        console.error(
          `Exception: Unknown Output Group Type ${jobSettings["OutputGroups"][outputGroup]["OutputGroupSettings"]["Type"]}`
        );
    }
  }

  return jobSettings;
};

exports.handler = async (event) => {
  console.log("event: ", JSON.stringify(event, null, 2));

  configurationSanityCheck();

  let application = "ignite";
  let assetID = uuidv4();
  let S3Bucket = event["detail"]["bucket"]["name"];
  let sourceS3Key = event["detail"]["object"]["key"];
  let sourceS3 = `s3://${S3Bucket}/${sourceS3Key}`;
  let destinationS3 = `s3://${S3Bucket}`;
  let mediaConvertRole = process.env.MEDIA_CONVERT_ROLE_ARN;

  const { Endpoints } = await mediaConvert
    .describeEndpoints(endpointMCparams)
    .promise();
  AWS.config.mediaconvert = { endpoint: Endpoints[0]["Url"] };

  // Only attempt to transcode videos placed in a post folder under uploads
  // Prefix should match uploads/posts/{userId}/{postId}/{filename}.
  // Valid video extensions include mp4, mov, and avi
  const validPath = new RegExp(
    "uploads/posts/[a-z0-9]{24}/[a-z0-9]{24}/[\\w\\-. ]+.(?:mp4|mov|avi)",
    "i"
  );
  if (!sourceS3Key.match(validPath)) {
    console.error(`Skipping: File ${sourceS3} is not a transcodable video.`);
    return;
  }

  let jobs = [];

  // Use MediaConvert SDK UserMetadata to tag jobs with the assetID
  // Events from MediaConvert will have the assetID in UserMedata
  let jobMetadata = {};
  jobMetadata["assetID"] = assetID;
  jobMetadata["application"] = application;
  jobMetadata["input"] = sourceS3;

  try {
    // Build a list of jobs to run against the input.
    let jobInput = {};
    const json_data = fs.readFileSync("job.json", "utf8");
    jobInput["filename"] = "Default";
    console.log(`jobInput: ${jobInput["filename"]}`);

    jobInput["settings"] = JSON.parse(json_data);
    console.log(
      "jobInput['settings']:",
      JSON.stringify(jobInput["settings"], null, 2)
    );

    jobs.push(jobInput);

    for (let j in jobs) {
      let jobSettings = jobs[j]["settings"];
      let jobFilename = jobs[j]["filename"];
      // Save the name of the settings file in the job userMetadata
      jobMetadata["settings"] = jobFilename;

      // Update the job settings with the source video from the S3 event
      jobSettings["Inputs"][0]["FileInput"] = sourceS3;

      // Update the job settings with the destination paths for converted videos.  We want to replace the
      // destination bucket of the output paths in the job settings, but keep the rest of the
      // path except for the file extension
      destinationS3 = `s3://${S3Bucket}/${sourceS3Key
        .replace("uploads/", "")
        .replace(/\.[^/.]+$/, "")}`;

      console.log(`destinationS3: ${destinationS3}`);
      jobSettings = updateOutputSettings(jobSettings, destinationS3);
      console.log("job settings:", JSON.stringify(jobSettings, null, 2));
      let params = {
        Role: mediaConvertRole,
        Settings: jobSettings,
        UserMetadata: jobMetadata,
      };

      // Convert the video using AWS Elemental MediaConvert
      let endpointCall = await new AWS.MediaConvert({
        apiVersion: "2017-08-29",
      })
        .createJob(params)
        .promise();
      console.log(endpointCall);
    }
  } catch (error) {
    console.error(error);
  }
};

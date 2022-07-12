import {
  S3Client,
  CopyObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { HttpRequest } from "@aws-sdk/protocol-http";
import { parseUrl } from "@aws-sdk/url-parser";
import fetch from "node-fetch";
import { Hash } from "@aws-sdk/hash-node";
import { S3RequestPresigner } from "@aws-sdk/s3-request-presigner";
import type { SignatureV4Init } from "@aws-sdk/signature-v4";
import { v4 as uuid } from "uuid";
import { formatUrl } from "@aws-sdk/util-format-url";

import { InternalServerError } from "./apollo/validate";

import "dotenv/config";

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_UPLOAD_REGION = process.env.AWS_REGION;
const MRAP_ENDPOINT = process.env.MRAP_ENDPOINT;
const S3_BUCKET = process.env.AWS_S3_BUCKET;

const VIDEO_EXTS = ["mp4", "mov", "avi"];

interface AWSCredentialsResponse {
  AccessKeyId: string;
  Expiration: string;
  RoleArn: string;
  SecretAccessKey: string;
  Token: string;
}

async function fetchAWSCredentials(): Promise<SignatureV4Init["credentials"]> {
  const AWS_CREDENTIALS_URI =
    process.env.AWS_CONTAINER_CREDENTIALS_RELATIVE_URI;

  try {
    const response = await fetch(`http://169.254.170.2${AWS_CREDENTIALS_URI}`, {
      timeout: 5000,
    });
    if (!response.ok) console.log("response", response);
    const credentials = (await response.json()) as AWSCredentialsResponse;
    return {
      accessKeyId: credentials.AccessKeyId,
      secretAccessKey: credentials.SecretAccessKey,
      expiration: new Date(credentials.Expiration),
      sessionToken: credentials.Token,
    };
  } catch (err) {
    console.log("Error fetching AWS credentials", err);
  }

  return {
    accessKeyId: AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: AWS_SECRET_ACCESS_KEY ?? "",
  };
}

export interface RemoteUpload {
  remoteName: string;
  uploadUrl: string;
}

export async function getUploadUrl(
  fileExt: string,
  type: "avatar" | "post" | "background" | "fund",
  id: string
): Promise<RemoteUpload> {
  // Attempt to first fetch AWS credentials from the local container credentials
  // endpoint

  if (!AWS_UPLOAD_REGION || !MRAP_ENDPOINT) {
    console.error("Missing AWS configuration");
    throw new InternalServerError("Missing AWS configuration");
  }

  const remoteFilename = `${uuid()}.${fileExt}`;
  const isVideo = VIDEO_EXTS.some((ext) => fileExt === ext);
  const remoteKey = `${
    isVideo && type === "post" ? "uploads/" : ""
  }${type}s/${id}/${remoteFilename}`;

  try {
    const credentials = await fetchAWSCredentials();
    const presigner = new S3RequestPresigner({
      credentials,
      region: AWS_UPLOAD_REGION,
      sha256: Hash.bind(null, "sha256"),
    });
    const objectUrl = `https://${MRAP_ENDPOINT}.accesspoint.s3-global.amazonaws.com/${remoteKey}`;
    const presignedUrl = await presigner.presign(
      new HttpRequest({ ...parseUrl(objectUrl), method: "PUT" }),
      { expiresIn: 60 }
    );
    const url = formatUrl(presignedUrl);
    return {
      remoteName: remoteFilename,
      uploadUrl: url,
    };
  } catch (err) {
    console.error(err);
    throw new InternalServerError("Not able to generate signed url.");
  }
}

type MoveResult = {
  success: boolean;
  mediaReady: boolean;
};

/**
 * Moves media associated with a post from a temporary upload location prefixed
 * with the user's user id to a location that includes the final post id.
 *
 * @param userId    The id of the user that uploaded the media asset.
 * @param posterId  The id of the poster. This is either the user id if the user
 *                  is posting as themselves, or a company id associated with
 *                  the user, if they are posting on behalf of that company.
 * @param postId    The id of the post the asset is associated with.
 * @param filename  The filename of the asset that was originally uploaded
 *                  to the temporary upload location in the S3 bucket.
 *
 * @returns   An object containing the success status of the operation as well
 *            as whether the media asset is ready for viewing. Videos are
 *            typically not immediately available as they must first be
 *            transcoded.
 */
export async function movePostMedia(
  userId: string,
  posterId: string,
  postId: string,
  filename: string
): Promise<MoveResult> {
  if (process.env.NODE_ENV === "test") {
    return {
      success: true,
      mediaReady: true,
    };
  }

  if (!AWS_UPLOAD_REGION || !S3_BUCKET) {
    console.error("Missing AWS configuration");
    throw new InternalServerError("Missing AWS configuration");
  }

  const isVideo = VIDEO_EXTS.some((ext) =>
    filename.toLowerCase().trim().endsWith(ext)
  );
  const originalKey = `${isVideo ? "uploads/" : ""}posts/${userId}/${filename}`;
  const newKey = `${
    isVideo ? "uploads/" : ""
  }posts/${posterId}/${postId}/${filename}`;

  const client = new S3Client({
    region: AWS_UPLOAD_REGION,
  });

  const copySource = `${S3_BUCKET}/${originalKey}`;
  const copyCommand = new CopyObjectCommand({
    Bucket: S3_BUCKET,
    CopySource: copySource,
    Key: newKey,
  });
  const deleteCommand = new DeleteObjectCommand({
    Bucket: S3_BUCKET,
    Key: originalKey,
  });

  try {
    console.log(
      "Copying asset from",
      copySource,
      "to",
      `${S3_BUCKET}/${newKey}`
    );
    await client.send(copyCommand);
    console.log("Deleting asset at", `${S3_BUCKET}/${originalKey}`);
    await client.send(deleteCommand);

    return {
      success: true,
      mediaReady: !isVideo,
    };
  } catch (err) {
    console.error(err);
    throw new InternalServerError("Error moving media asset");
  }
}

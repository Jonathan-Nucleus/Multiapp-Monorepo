import {
  S3Client,
  CopyObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { HttpRequest } from "@aws-sdk/protocol-http";
import { parseUrl } from "@aws-sdk/url-parser";
import { Hash } from "@aws-sdk/hash-node";
import { S3RequestPresigner } from "@aws-sdk/s3-request-presigner";
import { v4 as uuid } from "uuid";
import { formatUrl } from "@aws-sdk/util-format-url";

import { InternalServerError } from "./validate";

import "dotenv/config";

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_UPLOAD_REGION = process.env.AWS_REGION;
const MRAP_ENDPOINT = process.env.MRAP_ENDPOINT;
const S3_BUCKET = process.env.S3_BUCKET;

const VIDEO_EXTS = ["mp4", "mov", "avi"];

export interface RemoteUpload {
  remoteName: string;
  uploadUrl: string;
}

export async function getUploadUrl(
  fileExt: string,
  type: "avatar" | "post" | "background" | "fund",
  id: string
): Promise<RemoteUpload> {
  if (
    !AWS_UPLOAD_REGION ||
    !AWS_ACCESS_KEY_ID ||
    !AWS_SECRET_ACCESS_KEY ||
    !MRAP_ENDPOINT
  ) {
    throw new InternalServerError("Missing AWS configuration");
  }

  const remoteFilename = `${uuid()}.${fileExt}`;
  const isVideo = VIDEO_EXTS.some((ext) => fileExt === ext);
  const remoteKey = `${
    isVideo ? "uploads/" : ""
  }${type}s/${id}/${remoteFilename}`;

  try {
    const presigner = new S3RequestPresigner({
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
      region: AWS_UPLOAD_REGION,
      sha256: Hash.bind(null, "sha256"),
    });
    const objectUrl = `https://${MRAP_ENDPOINT}.accesspoint.s3-global.amazonaws.com/${remoteKey}`;
    const presignedUrl = await presigner.presign(
      new HttpRequest({ ...parseUrl(objectUrl), method: "PUT" }),
      {
        expiresIn: 60,
      }
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

export async function movePostMedia(
  userId: string,
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
    throw new InternalServerError("Missing AWS configuration");
  }

  const isVideo = VIDEO_EXTS.some((ext) =>
    filename.toLowerCase().trim().endsWith(ext)
  );
  const originalKey = `${isVideo ? "uploads/" : ""}posts/${userId}/${filename}`;
  const newKey = `${
    isVideo ? "uploads/" : ""
  }posts/${userId}/${postId}/${filename}`;

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

import {
  S3Client,
  PutObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuid } from "uuid";

import { InternalServerError } from "./validate";

import "dotenv/config";

const AWS_UPLOAD_REGION = process.env.AWS_REGION;
const S3_BUCKET = process.env.AWS_S3_BUCKET;
const S3_MEDIA_UPLOAD_BUCKET = process.env.S3_MEDIA_UPLOAD_BUCKET;

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
  if (!AWS_UPLOAD_REGION || !S3_BUCKET || !S3_MEDIA_UPLOAD_BUCKET) {
    throw new InternalServerError("Missing AWS configuration");
  }

  const remoteFilename = `${uuid()}.${fileExt}`;
  const remoteKey = `${type}s/${id}/${remoteFilename}`;

  const client = new S3Client({
    region: AWS_UPLOAD_REGION,
  });
  const command = new PutObjectCommand({
    Bucket: type === "post" ? S3_MEDIA_UPLOAD_BUCKET : S3_BUCKET,
    Key: remoteKey,
  });

  try {
    const url = await getSignedUrl(client, command, { expiresIn: 60 });
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

  if (!AWS_UPLOAD_REGION || !S3_BUCKET || !S3_MEDIA_UPLOAD_BUCKET) {
    throw new InternalServerError("Missing AWS configuration");
  }

  const originalKey = `posts/${userId}/${filename}`;
  const newKey = `posts/${userId}/${postId}/${filename}`;
  const isVideo = VIDEO_EXTS.some((ext) =>
    filename.toLowerCase().trim().endsWith(ext)
  );
  const destinationBucket = isVideo ? S3_MEDIA_UPLOAD_BUCKET : S3_BUCKET;

  const client = new S3Client({
    region: AWS_UPLOAD_REGION,
  });

  const copySource = `${S3_MEDIA_UPLOAD_BUCKET}/${originalKey}`;
  const copyCommand = new CopyObjectCommand({
    Bucket: destinationBucket,
    CopySource: copySource,
    Key: newKey,
  });
  const deleteCommand = new DeleteObjectCommand({
    Bucket: S3_MEDIA_UPLOAD_BUCKET,
    Key: originalKey,
  });

  try {
    console.log(
      "Copying asset from",
      copySource,
      "to",
      `${destinationBucket}/${newKey}`
    );
    await client.send(copyCommand);
    console.log(
      "Deleting asset at",
      `${S3_MEDIA_UPLOAD_BUCKET}/${originalKey}`
    );
    await client.send(deleteCommand);

    return {
      success: true,
      mediaReady: destinationBucket === S3_BUCKET,
    };
  } catch (err) {
    console.error(err);
    throw new InternalServerError("Error moving media asset");
  }
}

import { connect } from "getstream";
import jwt, { JwtPayload } from "jsonwebtoken";
import type { DeserializedUser } from "../db/collections/users";
import { BadRequestError } from "./validate";
import { InternalServerError } from "./validate";

import "dotenv/config";

if (!process.env.IGNITE_SECRET) {
  throw new Error("IGNITE_SECRET env var undefined");
}
const IGNITE_SECRET = process.env.IGNITE_SECRET as string;

export type AccessToken = string;
export type AccessTokenPayload = DeserializedUser;
export function getAccessToken(user: DeserializedUser): AccessToken {
  return jwt.sign(user, IGNITE_SECRET);
}

export type Token = string;
export type ResetTokenPayload = { email: string; tkn: string };
export function getResetToken(email: string, emailToken: string): Token {
  return jwt.sign(
    {
      email: email,
      tkn: emailToken,
    },
    IGNITE_SECRET
  );
}

export function decodeToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, IGNITE_SECRET, { complete: false }) as JwtPayload;
  } catch {
    throw new BadRequestError("Token is invalid.");
  }
}

const GETSTREAM_ACCESS_KEY = process.env.GETSTREAM_ACCESS_KEY;
const GETSTREAM_SECRET = process.env.GETSTREAM_SECRET;
const GETSTREAM_APP_ID = process.env.GETSTREAM_APP_ID;

export function getChatToken(userId: string): string {
  if (!GETSTREAM_ACCESS_KEY || !GETSTREAM_SECRET || !GETSTREAM_APP_ID) {
    throw new InternalServerError("Missing GetStream configuration");
  }

  const client = connect(
    GETSTREAM_ACCESS_KEY,
    GETSTREAM_SECRET,
    GETSTREAM_APP_ID
  );

  return client.createUserToken(userId);
}

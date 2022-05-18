import { StreamChat, DefaultGenerics } from "stream-chat";
import { User } from "backend/schemas/user";
import { Company } from "backend/schemas/company";

import "dotenv/config";

if (!process.env.GETSTREAM_ACCESS_KEY || !process.env.GETSTREAM_SECRET) {
  throw new Error("Invalid server configuration for GetStream");
}

const GETSTREAM_ACCESS_KEY = process.env.GETSTREAM_ACCESS_KEY;
const GETSTREAM_SECRET = process.env.GETSTREAM_SECRET;

function getClient(): StreamChat<DefaultGenerics> {
  return StreamChat.getInstance(GETSTREAM_ACCESS_KEY, GETSTREAM_SECRET);
}

/**
 * Retrieve an access token for the get stream API for a specifick Prometheus
 * user.
 *
 * @param userId    The id of the prometheus user.
 *
 * @returns A GetStream user token that can be used to authenticate against the
 *          GetStream API for the user.
 */
export function getChatToken(userId: string): string {
  const client = getClient();
  return client.createToken(userId);
}

/**
 * Registers a user with GetStream.
 */
export async function registerUser(
  user: User.Mongo,
  company: Company.Mongo | null
): Promise<boolean> {
  try {
    const client = getClient();
    await client.upsertUsers([
      {
        id: user._id.toString(),
        name: user.fullName,
        image: user.avatar,
        company: company?.name,
        position: user.position,
      },
    ]);

    return true;
  } catch (err) {
    console.log("Error registering user with get stream", err);
    return false;
  }
}

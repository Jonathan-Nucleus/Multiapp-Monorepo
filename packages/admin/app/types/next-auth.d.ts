import { DefaultSession } from "next-auth";
import type { AccessTokenPayload } from "backend/lib/tokens";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    access_token: string;
    user?: DefaultSession["user"] & AccessTokenPayload;
  }
}

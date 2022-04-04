import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      email: string;
    } & DefaultSession["user"];
  }

  interface PagesOptions {
    signUp: string;
    forgotPassword: string;
    resetPassword: string;
    inviteCode: string;
    preferences: string;
  }
}

import { withAuth } from "next-auth/middleware";
import AppAuthOptions from "../app/config/auth";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const pages = AppAuthOptions.pages;
      if (
        req.page.name == pages?.signIn ||
        req.page.name == pages?.signOut ||
        req.page.name == pages?.error
      ) {
        return true;
      } else {
        return !!token;
      }
    },
  },
});

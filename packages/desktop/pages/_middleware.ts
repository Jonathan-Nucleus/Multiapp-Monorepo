import { withAuth } from "next-auth/middleware";
import AppAuthOptions from "../app/config/auth";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const pages = AppAuthOptions.pages;
      if (
        req.page.name == pages?.signIn ||
        req.page.name == pages?.signOut ||
        req.page.name == pages?.error ||
        req.page.name == pages?.forgotPassword ||
        req.page.name == pages?.resetPassword
      ) {
        return true;
      } else {
        return !!token;
      }
    },
  },
});

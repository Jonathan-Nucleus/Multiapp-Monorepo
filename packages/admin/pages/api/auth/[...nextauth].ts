import NextAuth from "next-auth";
import AppAuthOptions from "../../../app/backend/config/auth";

import "dotenv/config"; // Include to force inclusion of module in next build

export default NextAuth(AppAuthOptions);

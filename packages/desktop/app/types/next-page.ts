import { NextPage } from "next";

export interface AppPageProps {
  layout?: "auth" | "main" | undefined;
  middleware?: "auth" | "guest";
}

export type NextPageWithLayout<P = {}> = NextPage<P> & AppPageProps;

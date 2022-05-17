import { NextPage } from "next";

export interface AppPageProps {
  layout?: "auth" | "main" | "main-fluid" | undefined;
  middleware?: "auth" | "guest";
}

export type NextPageWithLayout<P = {}> = NextPage<P> & AppPageProps;

import { NextPage } from "next";

export interface AppPageProps {
  layout?: "auth" | "main" | "main-fluid" | "main.full-height";
  background?: "default" | "radial";
  middleware?: "auth" | "guest";
}

export type NextPageWithLayout<P = {}> = NextPage<P> & AppPageProps;

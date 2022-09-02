import { Request, Response } from "express";
import fetch from "node-fetch";

const healthCheck = async (
  reqIgnored: Request,
  res: Response
): Promise<void> => {
  // Perform request to apollo server to test both db connection and successful
  // apollo server start
  const response = await fetch("http://localhost:4000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query:
        "query RequiresUpdate($version: String!, $build: String!) {\n  requiresUpdate(version: $version, build: $build)\n}",
      variables: { version: "2.0.0", build: "1" },
    }),
  });

  res.status(response.status).end();
};

export default healthCheck;

import type { NextApiRequest, NextApiResponse } from "next";

const healthCheck = async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).end();
};

export default healthCheck;

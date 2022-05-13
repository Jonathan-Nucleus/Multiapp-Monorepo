import type { NextApiRequest, NextApiResponse } from "next";
import createMetascraper from "metascraper";
import metascraperLogoFavIcon from "metascraper-logo-favicon";
import metascraperTitle from "metascraper-title";
import metascraperImage from "metascraper-image";

const api = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = JSON.parse(req.body);
  const { url } = body as Record<string, string>;
  try {
    const response = await fetch(url);
    const html = await response.text();
    const metascraper = createMetascraper([
      metascraperLogoFavIcon(),
      metascraperTitle(),
      metascraperImage(),
    ]);
    const metadata = await metascraper({ html, url });
    res.status(200).json(metadata);
  } catch ({ message }) {
    res.status(200).json({ error: message });
  }
};

export default api;


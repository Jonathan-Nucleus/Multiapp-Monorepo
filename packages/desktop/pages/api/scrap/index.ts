import type { NextApiRequest, NextApiResponse } from "next";
import createMetascraper from "metascraper";
import metascraperLogoFavIcon from "metascraper-logo-favicon";
import metascraperTitle from "metascraper-title";
import metascraperImage from "metascraper-image";

export type SiteMetadata = {
  logo?: string;
  title?: string;
  image?: string;
  error?: string;
}

const api = async (req: NextApiRequest, res: NextApiResponse<SiteMetadata>) => {
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
    res.status(200).json(metadata as SiteMetadata);
  } catch (error) {
    res.status(200).json({ error: JSON.stringify(error) });
  }
};

export default api;


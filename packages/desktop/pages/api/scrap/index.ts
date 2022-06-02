import type { NextApiRequest, NextApiResponse } from "next";
import { CheerioAPI, load as loadHtml } from "cheerio";
// import { getSession } from "next-auth/react";

export type SiteMetadata = {
  logo?: string;
  title?: string;
  image?: string;
  error?: string;
};

const api = async (req: NextApiRequest, res: NextApiResponse<SiteMetadata>) => {
  // This section is to secure the route to authenticated users only.
  // Temporarily disabled for now to speed up.
  // const session = await getSession({ req });
  // if (!session) {
  //   res.status(401);
  // }
  if (req.method != "POST") {
    res.status(405);
  }
  const body = JSON.parse(req.body);
  const { url: urlString } = body as Record<string, string>;
  try {
    const url = new URL(urlString);
    const response = await fetch(urlString);
    const html = await response.text();
    const $ = loadHtml(html);
    let favicon = $("link[rel*='icon']").attr("href");
    if (favicon) {
      if (!favicon.startsWith("http")) {
        favicon = `${url.origin}${
          favicon.startsWith("/") ? "" : "/"
        }${favicon}`;
      }
    } else {
      favicon = `${url.origin}/favicon.ico`;
    }
    let image = findImages($).find((item) => !!item);
    if (image && !image.startsWith("http")) {
      image = `${url.origin}${image.startsWith("/") ? "" : "/"}${image}`;
    }
    res.status(200).json({
      logo: favicon,
      title: $("title").text(),
      image: image,
    });
  } catch (error) {
    res.status(200).json({ error: JSON.stringify(error) });
  }
};

const findImages = ($: CheerioAPI) => {
  return [
    $('meta[property="og:image:secure_url"]').attr("content"),
    $('meta[property="og:image:url"]').attr("content"),
    $('meta[property="og:image"]').attr("content"),
    $('meta[name="twitter:image:src"]').attr("content"),
    $('meta[property="twitter:image:src"]').attr("content"),
    $('meta[name="twitter:image"]').attr("content"),
    $('meta[property="twitter:image"]').attr("content"),
    $('meta[itemprop="image"]').attr("content"),
    $("article img[src]").attr("src"),
    $("#content img[src]").attr("src"),
    $('img[alt*="author" i]').attr("src"),
    $('img[src]:not([aria-hidden="true"])').attr("src"),
  ];
};

export default api;

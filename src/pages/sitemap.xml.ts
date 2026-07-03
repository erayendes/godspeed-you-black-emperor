import { albums } from "../data/albums";
import { crossingPaths } from "../data/crossingPaths";
import { members } from "../data/members";
import { shows } from "../data/shows";

const site = "https://gybe.org";

export const prerender = true;

type SitemapPage = {
  path: string;
  priority: string;
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
  lastmod?: string;
};

const staticPages: SitemapPage[] = [
  { path: "/", priority: "1.0", changefreq: "weekly", lastmod: shows.lastChecked },
  { path: "/about/", priority: "0.8", changefreq: "monthly", lastmod: shows.lastChecked },
  { path: "/disco/", priority: "0.9", changefreq: "monthly", lastmod: shows.lastChecked },
  { path: "/shows/", priority: "0.8", changefreq: "weekly", lastmod: shows.lastChecked },
  { path: "/members/", priority: "0.8", changefreq: "monthly", lastmod: shows.lastChecked },
  { path: "/crossing-paths/", priority: "0.8", changefreq: "monthly", lastmod: shows.lastChecked },
  { path: "/contact/", priority: "0.5", changefreq: "yearly", lastmod: shows.lastChecked },
];

const dynamicPages: SitemapPage[] = [
  ...albums.map((album) => ({ path: `/disco/${album.slug}/`, priority: "0.7", changefreq: "yearly" as const, lastmod: shows.lastChecked })),
  ...members.map((member) => ({ path: `/members/${member.slug}/`, priority: "0.6", changefreq: "yearly" as const, lastmod: shows.lastChecked })),
  ...crossingPaths.map((item) => ({ path: `/crossing-paths/${item.slug}/`, priority: "0.6", changefreq: "yearly" as const, lastmod: shows.lastChecked })),
];

const pages: SitemapPage[] = [...staticPages, ...dynamicPages];

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map((page) => {
    const loc = `${site}${page.path}`;
    const lastmod = page.lastmod ? `\n    <lastmod>${escapeXml(page.lastmod)}</lastmod>` : "";

    return `  <url>
    <loc>${escapeXml(loc)}</loc>${lastmod}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  })
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}

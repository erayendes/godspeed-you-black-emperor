const host = "gybe.org";
const key = "4e1797aba223af6644ecfa36ae6206a4";
const keyLocation = `https://${host}/${key}.txt`;
const sitemapUrl = `https://${host}/sitemap.xml`;
const endpoint = "https://www.bing.com/indexnow";

function extractUrls(sitemap) {
  return [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
    match[1]
      .replaceAll("&amp;", "&")
      .replaceAll("&lt;", "<")
      .replaceAll("&gt;", ">")
      .replaceAll("&quot;", '"')
      .replaceAll("&apos;", "'"),
  );
}

async function main() {
  const sitemapResponse = await fetch(sitemapUrl);

  if (!sitemapResponse.ok) {
    throw new Error(`Failed to fetch sitemap: ${sitemapResponse.status} ${sitemapResponse.statusText}`);
  }

  const sitemap = await sitemapResponse.text();
  const urlList = extractUrls(sitemap);

  if (urlList.length === 0) {
    throw new Error("No URLs found in sitemap.");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      host,
      key,
      keyLocation,
      urlList,
    }),
  });

  const body = await response.text();

  console.log(JSON.stringify({
    endpoint,
    status: response.status,
    ok: response.ok,
    submittedUrls: urlList.length,
    body: body.trim(),
  }, null, 2));

  if (!response.ok) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

const { test, expect } = require("@playwright/test");

test("internal pages, fragments, image and supplementary links resolve", async ({ page, request, baseURL }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-light", "The same generated links serve every viewport");
  test.setTimeout(120000);
  const queue = ["/", "/publications/", "/presentations/", "/news/", "/cv/"];
  const checked = new Set();
  const pages = new Set();
  let targetCount = 0;
  while (queue.length) {
    const route = queue.shift();
    if (pages.has(route)) continue;
    pages.add(route);
    const response = await request.get(route);
    expect(response.ok(), route).toBe(true);
    const html = await response.text();
    const links = await page.evaluate(({ html, route, origin }) => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return Array.from(doc.querySelectorAll("a[href], img[src], script[src], link[rel='stylesheet'][href]"), (node) => {
        const raw = node.getAttribute("href") || node.getAttribute("src");
        try { return new URL(raw, origin + route).href; } catch { return null; }
      }).filter(Boolean);
    }, { html, route, origin: baseURL });
    for (const href of links) {
      const url = new URL(href);
      if (![new URL(baseURL).host, "george-webber.com", "www.george-webber.com"].includes(url.host)) continue;
      const target = url.pathname + url.search;
      if (checked.has(target + url.hash)) continue;
      checked.add(target + url.hash);
      const result = await request.get(target);
      expect(result.ok(), `${route} links to ${target}`).toBe(true);
      targetCount += 1;
      if (result.headers()["content-type"]?.includes("text/html")) {
        const content = await result.text();
        if (url.hash) {
          const ids = await page.evaluate((text) => Array.from(new DOMParser().parseFromString(text, "text/html").querySelectorAll("[id]"), (node) => node.id), content);
          expect(ids, `${target}${url.hash}`).toContain(decodeURIComponent(url.hash.slice(1)));
        }
        if ((url.pathname.startsWith("/news/") || url.pathname.startsWith("/presentations/")) && !pages.has(url.pathname)) queue.push(url.pathname);
      }
    }
  }
  for (const source of ["/_scripts/test-site.cjs", "/tests/publications.spec.cjs", "/playwright.config.cjs", "/site.ps1"]) {
    expect((await request.get(source)).status(), `${source} should not be published`).toBe(404);
  }
  await testInfo.attach("link-audit", { body: Buffer.from(JSON.stringify({ pages: pages.size, targets: targetCount }, null, 2)), contentType: "application/json" });
});

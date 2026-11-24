const { test: base, expect } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const records = JSON.parse(fs.readFileSync(path.join(root, ".test-artifacts/publications.json"), "utf8"));
const selectedKeys = ["webber2026flow_mpc", "webber2025distributional_consistency_loss", "webber2025likelihood_scheduled", "webber2025supervised_diffusion"];
const cards = "#publication-results .bibliography > li";
const principal = (record) => record.first_author || record.cofirst_author;
const test = base.extend({
  runtimeErrors: [async ({ page }, use) => {
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await use(errors);
    expect(errors, "No uncaught browser errors").toEqual([]);
  }, { auto: true }],
});

test.beforeEach(async ({ page }, testInfo) => {
  await page.addInitScript((theme) => localStorage.setItem("theme", theme), testInfo.project.use.colorScheme);
});

async function publications(page) {
  await page.goto("/publications/");
  await expect(page.locator(".publication-filters")).toBeVisible();
}

async function expectKeys(page, expected) {
  await expect(page.locator(`${cards}:visible`)).toHaveCount(expected.length);
  const keys = await page.locator(`${cards}:visible [data-publication-type] > div[id]`).evaluateAll((nodes) => nodes.map((node) => node.id));
  expect(keys.slice().sort()).toEqual(expected.map((record) => record.key).sort());
  const correctHeadings = await page.locator("#publication-results h2.bibliography").evaluateAll((headings) => headings.every((heading) => {
    const list = heading.nextElementSibling;
    return heading.hidden === !Array.from(list.children).some((item) => !item.hidden);
  }));
  expect(correctHeadings, "Empty years must disappear").toBe(true);
}

test("default record is comprehensive, chronological and highlights every authorship position", async ({ page }) => {
  await publications(page);
  await expect(page.locator("#publication-type")).toHaveValue("all");
  await expect(page.locator("#publication-first-author")).not.toBeChecked();
  await expectKeys(page, records);
  const actualOrder = await page.locator(`${cards} [data-publication-type] > div[id]`).evaluateAll((nodes) => nodes.map((node) => node.id));
  const chronological = records.slice().sort((a, b) => b.year - a.year || b.month - a.month);
  expect(actualOrder).toEqual(chronological.map((record) => record.key));
  await expect(page.locator(`${cards} .author strong`)).toHaveCount(records.length);
  await expect(page.locator("#poveda2026domain_randomization .author strong")).toContainText("Webber");
});

test("all publication type and authorship combinations filter without reloading", async ({ page }) => {
  await publications(page);
  const documentOrigin = await page.evaluate(() => performance.timeOrigin);
  for (const category of ["all", "journal", "conference", "workshop", "abstract"]) {
    await page.getByLabel("Publication type", { exact: true }).selectOption(category);
    for (const firstOnly of [false, true]) {
      await page.getByLabel("First- and co-first-author only", { exact: true }).setChecked(firstOnly);
      const expected = records.filter((record) => (category === "all" || record.category === category) && (!firstOnly || principal(record)));
      await expectKeys(page, expected);
      await expect(page.locator("#publication-count")).toHaveText(`${expected.length} ${expected.length === 1 ? "publication" : "publications"}`);
    }
  }
  expect(await page.evaluate(() => performance.timeOrigin)).toBe(documentOrigin);
});

test("collaborative papers return when authorship is cleared and co-first contributions remain", async ({ page }) => {
  await publications(page);
  await page.locator("#publication-first-author").check();
  await expect(page.locator("#bell2026cardiac_motion")).not.toBeVisible();
  await expect(page.locator("#webber2026flow_mpc")).toBeVisible();
  await expect(page.locator("#webber2026flow_mpc .equal-contribution")).toContainText("Equal contribution");
  await expect(page.locator("#webber2026flow_mpc .author sup")).toHaveCount(2);
  await page.locator("#publication-first-author").uncheck();
  await expect(page.locator("#bell2026cardiac_motion")).toBeVisible();
});

test("search combines with filters and empty results hide every year heading", async ({ page }) => {
  await publications(page);
  await page.locator("#publication-type").selectOption("workshop");
  await page.getByRole("searchbox").fill("CARDIAC");
  await expectKeys(page, records.filter((record) => record.key === "bell2026cardiac_motion"));
  await page.locator("#publication-first-author").check();
  await expectKeys(page, []);
  await expect(page.locator("#publication-empty")).toBeVisible();
  await page.locator("#publication-first-author").uncheck();
  await expect(page.locator("#bell2026cardiac_motion")).toBeVisible();
  await page.getByRole("searchbox").fill("no-publication-matches-this-query");
  await expectKeys(page, []);
  await page.getByRole("searchbox").fill("");
  await page.locator("#publication-type").selectOption("all");
  await expectKeys(page, records);
  await expect(page.locator("#publication-empty")).not.toBeVisible();
});

test("existing publication fragment links and malformed escapes are handled", async ({ page }) => {
  await page.goto("/publications/#webber2025distributional_consistency_loss");
  await expectKeys(page, records.filter((record) => record.key === "webber2025distributional_consistency_loss"));
  await page.evaluate(() => { location.hash = "%E0%A4%A"; });
  await expectKeys(page, []);
  await page.evaluate(() => { location.hash = ""; });
  await expectKeys(page, records);
});

test("abstract and TLDR expansion survive filtering", async ({ page }) => {
  await publications(page);
  const paper = page.locator("#webber2026flow_mpc");
  await paper.locator("a.abstract").click();
  await expect(paper.locator("div.abstract.hidden.open")).toBeVisible();
  await page.locator("#publication-type").selectOption("journal");
  await page.locator("#publication-type").selectOption("all");
  await expect(paper.locator("div.abstract.hidden.open")).toBeVisible();
  await paper.locator("a.tldr").click();
  await expect(paper.locator("div.tldr.hidden.open")).toBeVisible();
  await expect(paper.locator("a[href='https://github.com/alexdenker/MPCFlow']")).toBeVisible();
});

test("filters are keyboard accessible", async ({ page }) => {
  await publications(page);
  await page.getByRole("searchbox").focus();
  await page.keyboard.press("Tab");
  await expect(page.locator("#publication-type")).toBeFocused();
  await page.keyboard.press("Home");
  await page.keyboard.press("ArrowDown");
  await expect(page.locator("#publication-type")).toHaveValue("journal");
  await page.keyboard.press("Tab");
  await expect(page.locator("#publication-first-author")).toBeFocused();
  await page.keyboard.press("Space");
  await expect(page.locator("#publication-first-author")).toBeChecked();
  await expectKeys(page, records.filter((record) => record.category === "journal" && principal(record)));
});

test("site-wide search retains its generated navigation index", async ({ page }) => {
  await page.goto("/");
  await expect.poll(() => page.evaluate(() => {
    const entries = document.querySelector("ninja-keys")?.data;
    return Array.isArray(entries) && entries.some((entry) => entry.title.toLowerCase() === "publications");
  })).toBe(true);
  await page.keyboard.press("Control+k");
  const search = page.locator("ninja-keys input");
  await expect(search).toBeVisible();
  await search.fill("publications");
  await search.press("Enter");
  await expect(page).toHaveURL(/\/publications\/$/);
});

test("homepage has exactly the four curated papers and open summaries", async ({ page }, testInfo) => {
  await page.goto("/");
  const homeKeys = await page.locator(".publications .row > div[id]").evaluateAll((nodes) => nodes.map((node) => node.id));
  expect(homeKeys).toEqual(selectedKeys);
  await expect(page.locator(".publications div.tldr.hidden.open")).toHaveCount(4);
  await expect(page.getByRole("link", { name: "View all publications", exact: true })).toHaveAttribute("href", "/publications/");
  await expect(page.getByRole("heading", { name: "Teaching and academic service" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await testInfo.attach("homepage", { body: await page.screenshot({ fullPage: true }), contentType: "image/png" });
});

test("thumbnails, credits and both themes fit the viewport", async ({ page }, testInfo) => {
  await publications(page);
  await expect(page.locator("html")).toHaveAttribute("data-theme", testInfo.project.use.colorScheme);
  const images = page.locator(`${cards} .preview`);
  await expect(images).toHaveCount(records.filter((record) => record.preview).length);
  await expect.poll(() => images.evaluateAll((nodes) => nodes.every((image) => image.complete && image.naturalWidth > 0 && image.alt.length > 20))).toBe(true);
  await expect(page.locator(`${cards} .preview-credit`)).toHaveCount(records.filter((record) => record.preview_credit).length);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await testInfo.attach("publications", { body: await page.screenshot({ fullPage: true }), contentType: "image/png" });
});

test("news and presentations retain awards, older talks and month precision", async ({ page }) => {
  await page.goto("/presentations/");
  const talkCount = fs.readdirSync(path.join(root, "_presentations")).filter((file) => file.endsWith(".md")).length;
  await expect(page.locator("article h3")).toHaveCount(talkCount);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto("/news/");
  await expect(page.locator(".news")).toContainText("PGR Research Excellence Prize");
  await expect(page.locator(".news")).toContainText("Best Oral Presentation");
  await expect(page.locator(".news tr").filter({ hasText: "Presented MPC-Flow at" }).locator("th")).toHaveText("Oct 2026");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("structured CV comes from the canonical bibliography and PDF downloads intact", async ({ request }) => {
  const response = await request.get("/assets/json/resume.json");
  expect(response.ok()).toBe(true);
  const resume = await response.json();
  const expected = records.filter((record) => record.cv_selected).sort((a, b) => a.cv_order - b.cv_order);
  expect(resume.publications.map((paper) => paper.name)).toEqual(expected.map((record) => record.title));
  expect(JSON.parse(fs.readFileSync(path.join(root, "assets/json/resume.json"), "utf8")).publications).toBeUndefined();
  const pdf = await request.get("/assets/pdf/CV.pdf");
  expect(pdf.headers()["content-type"]).toBe("application/pdf");
  expect((await pdf.body()).equals(fs.readFileSync(path.join(root, "assets/pdf/CV.pdf")))).toBe(true);
});

test("conference references stay concise and abstract buttons never lead to the programme", async ({ page }) => {
  await publications(page);
  await expect(page.locator("#webber2026flow_mpc .periodical").first()).toHaveText("In ICML, Jul 2026");
  for (const record of records.filter((record) => record.category === "abstract")) {
    const paper = page.locator(`#${record.key}`);
    await expect(paper.locator(".periodical").first()).toHaveText(/^\s*In IEEE NSS\/MIC, [A-Z][a-z]{2} \d{4}\s*$/);
    await expect(paper.locator(".periodical").filter({ hasText: /Abstract \d+|MIC-\d/ })).toHaveCount(0);
    await expect(paper.locator("a[href*='online-program']")).toHaveCount(0);
    if (record.year === 2026) await expect(paper.locator(".links a").filter({ hasText: /^HTML$/ })).toHaveCount(0);
  }
});

test("presentations are a single visitor-facing page with anchored news links", async ({ page, request }) => {
  await page.goto("/presentations/");
  await expect(page.locator("article h3 a")).toHaveCount(0);
  await expect(page.locator("#jul-2025-maths4dl")).toBeVisible();
  await expect(page.locator("#nov-2025-mic")).toBeVisible();
  await expect(page.locator("#sept-2025-miccai")).toBeVisible();
  await expect(page.locator("article")).toContainText("I presented a research poster at the Maths4DL");
  await expect(page.locator("article")).not.toContainText(/Original conference report|Conference report|abstract 1883|MIC-01-03/);
  const internalLinks = await page.locator("article a[href^='/presentations/']").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")));
  expect(internalLinks.every((href) => href === "/presentations/" || href.startsWith("/presentations/#"))).toBe(true);
  for (const route of ["jul-2025-maths4dl", "nov-2026-flow-pet", "nov-2025-mic"]) {
    expect((await request.get(`/presentations/${route}/`)).status()).toBe(404);
  }
  await page.goto("/news/");
  await expect(page.locator("a[href='/presentations/#nov-2026-flow-pet']")).toBeVisible();
  await expect(page.locator("a[href='/presentations/#apr-2026-iclr']")).toBeVisible();
  await page.goto("/");
  await expect.poll(() => page.evaluate(() => document.querySelector("ninja-keys")?.data?.some((entry) => entry.section === "Presentations" && entry.title.includes("Maths4DL")))).toBe(true);
  await page.evaluate(() => document.querySelector("ninja-keys").data.find((entry) => entry.section === "Presentations" && entry.title.includes("Maths4DL")).handler());
  await expect(page).toHaveURL(/\/presentations\/#jul-2025-maths4dl$/);
  await expect(page.locator("#jul-2025-maths4dl")).toBeVisible();
});

test("news shows month and year while retaining full machine-readable dates", async ({ page }) => {
  for (const route of ["/", "/news/"]) {
    await page.goto(route);
    const dates = await page.locator(".news th time").evaluateAll((nodes) => nodes.map((node) => ({ text: node.textContent.trim(), datetime: node.getAttribute("datetime") })));
    expect(dates.length).toBeGreaterThan(0);
    for (const date of dates) {
      expect(date.text).toMatch(/^[A-Z][a-z]{2} \d{4}$/);
      expect(date.datetime).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    }
  }
  await page.goto("/news/maths4dl_poster.html");
  await expect(page.locator(".post-meta")).toHaveText("July 2025");
  await expect(page.locator(".post-meta time")).toHaveAttribute("datetime", /^2025-07-09T/);
});

test("full bibliography remains readable without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}/publications/`);
    await expect(page.locator(`${cards}:visible`)).toHaveCount(records.length);
  } finally { await context.close(); }
});

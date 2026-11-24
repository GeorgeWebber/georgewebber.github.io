const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const artifacts = path.join(root, ".test-artifacts");
const env = { ...process.env, SITE_BUILD_DIR: process.env.SITE_BUILD_DIR || ".test-artifacts/site" };
fs.mkdirSync(artifacts, { recursive: true });

function run(command, args, capture = false) {
  const result = spawnSync(command, args, {
    cwd: root, env, shell: process.platform === "win32",
    ...(capture ? { encoding: "utf8" } : { stdio: "inherit" }),
  });
  if (result.error || result.status !== 0) {
    if (capture) process.stderr.write(`${result.stdout || ""}${result.stderr || ""}`);
    if (result.error) console.error(result.error.message);
    process.exit(result.status || 1);
  }
  return result.stdout;
}

run("bundle", ["exec", "ruby", "tests/publication_metadata_test.rb"]);
const manifest = run("bundle", ["exec", "ruby", "_scripts/publication_manifest.rb"], true);
JSON.parse(manifest); // Reject malformed fixtures before running the browser suite.
fs.writeFileSync(path.join(artifacts, "publications.json"), manifest);
run(process.execPath, ["_scripts/build-site.cjs"]);
const playwrightCLI = path.join(path.dirname(require.resolve("@playwright/test/package.json")), "cli.js");
run(process.execPath, [playwrightCLI, "test", ...process.argv.slice(2)]);

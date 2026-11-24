const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const buildDirectory = process.env.SITE_BUILD_DIR || "_site";
const logDirectory = path.join(root, ".test-artifacts");
fs.mkdirSync(logDirectory, { recursive: true });

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    env: { ...process.env, JEKYLL_ENV: "production", SITE_BUILD_DIR: buildDirectory },
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
    shell: process.platform === "win32",
  });
  fs.appendFileSync(path.join(logDirectory, "build.log"), `${command} ${args.join(" ")}\n${result.stdout || ""}${result.stderr || ""}\n`);
  if (result.error || result.status !== 0) {
    process.stderr.write(result.stdout || "");
    process.stderr.write(result.stderr || "");
    if (result.error) console.error(result.error.message);
    process.exit(result.status || 1);
  }
}

fs.writeFileSync(path.join(logDirectory, "build.log"), "");
console.log(`Building production site into ${buildDirectory}...`);
run("bundle", ["exec", "jekyll", "build", "--destination", buildDirectory]);
const purgeCLI = path.join(path.dirname(require.resolve("purgecss/package.json")), "bin", "purgecss.js");
run(process.execPath, [purgeCLI, "-c", "purgecss.config.js"]);
console.log("Production build and CSS pruning passed.");

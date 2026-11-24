const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

process.chdir(path.resolve(__dirname, ".."));
let child;
let stopping = false;
let restarting = false;

function start() {
  child = spawn("bundle", ["exec", "jekyll", "serve", "--host", "0.0.0.0", "--port", "8080", "--livereload", "--force_polling"], {
    stdio: "inherit", shell: process.platform === "win32",
  });
  child.on("error", (error) => {
    console.error(error.message);
    fs.unwatchFile("_config.yml");
    process.exitCode = 1;
  });
  child.on("exit", (code) => {
    if (restarting && !stopping) { restarting = false; start(); }
    else { fs.unwatchFile("_config.yml"); process.exitCode = stopping ? 0 : (code || 1); }
  });
}

fs.watchFile("_config.yml", { interval: 1000 }, (current, previous) => {
  if (current.mtimeMs !== previous.mtimeMs && !stopping && !restarting) {
    console.log("Configuration changed; restarting Jekyll...");
    restarting = true;
    child.kill("SIGTERM");
  }
});
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => {
  stopping = true;
  fs.unwatchFile("_config.yml");
  child?.kill("SIGTERM");
});
start();

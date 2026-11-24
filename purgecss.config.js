const buildDirectory = process.env.SITE_BUILD_DIR || "_site";

module.exports = {
  content: [`${buildDirectory}/**/*.html`, `${buildDirectory}/**/*.js`],
  css: [`${buildDirectory}/assets/css/*.css`],
  output: `${buildDirectory}/assets/css/`,
  skippedContentGlobs: [`${buildDirectory}/assets/**/*.html`],
};

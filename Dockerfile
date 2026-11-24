FROM node:22.17.1-bookworm-slim AS node
FROM ruby:3.3.5-bookworm

ENV DEBIAN_FRONTEND=noninteractive \
    BUNDLE_FROZEN=true \
    BUNDLE_PATH=/usr/local/bundle \
    EXECJS_RUNTIME=Node \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright \
    NODE_PATH=/opt/site-dependencies/node_modules \
    PATH=/opt/site-dependencies/node_modules/.bin:$PATH

COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -s ../lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
    && ln -s ../lib/node_modules/npm/bin/npx-cli.js /usr/local/bin/npx \
    && apt-get update \
    && apt-get install -y --no-install-recommends imagemagick jupyter-core python3-nbconvert python3-ipython \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/site-dependencies
COPY Gemfile Gemfile.lock package.json package-lock.json ./
RUN gem install --no-document bundler:2.6.9 \
    && bundle install --jobs 4 \
    && npm ci \
    && ./node_modules/.bin/playwright install --with-deps --only-shell chromium \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspaces/site
EXPOSE 8080 35729
CMD ["bash", "bin/entry_point.sh"]

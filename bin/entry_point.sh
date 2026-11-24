#!/usr/bin/env bash
set -euo pipefail

# This is the one bind-mounted checkout we intentionally edit in this container.
git config --global --add safe.directory /workspaces/site
bundle check
exec npm run dev

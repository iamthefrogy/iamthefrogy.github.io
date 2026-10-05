#!/bin/bash
set -e

# Usage: ./deploy.sh "what changed"   (message is optional)
git add .
git commit -m "${1:-updated site}" || true
git push origin main

# public/ is a git worktree checked out on gh-pages (see: git worktree list).
# Never use `hugo --cleanDestinationDir` here - it deletes public/.git along
# with stale pages, which turns the worktree back into a plain folder and
# breaks every deploy after it. Clean by hand, skipping .git, instead.
find public -mindepth 1 ! -path 'public/.git' ! -path 'public/.git/*' -delete
hugo --minify
find public -name .DS_Store -delete

cd public
git add .
git commit -m "deploying updated site" || true
git push origin gh-pages

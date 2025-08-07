#!/bin/bash
git add .
git commit -m "updated site"
git push origin main
hugo --minify --cleanDestinationDir
cd public
git checkout gh-pages
git add .
git commit -m "deploying updated site"
git push origin gh-pages

#!/bin/sh
set -e

if [ -z "$CONTENT_ROOT" ]; then
  echo "Error: CONTENT_ROOT must be defined."
  exit 1
fi

npm install
mkdir -p out/static
export BUILD_OUT_ROOT=out
npm run rari build
npm run build
node build/ssr.js
cp -r dist/* out/static/

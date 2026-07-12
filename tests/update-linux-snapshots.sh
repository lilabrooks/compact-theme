#!/usr/bin/env sh
set -eu

root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
output="$root/tests/__screenshots__/theme.spec.js/linux"

mkdir -p "$output"

docker run --rm --ipc=host \
  -e HOST_UID="$(id -u)" \
  -e HOST_GID="$(id -g)" \
  -v "$root:/src:ro" \
  -v "$output:/output" \
  -w /work \
  mcr.microsoft.com/playwright:v1.61.1-noble \
  bash -lc 'cp -a /src/. /work && npm ci --silent && npm run test:update-snapshots && cp -a /work/tests/__screenshots__/theme.spec.js/linux/. /output/ && chown -R "$HOST_UID:$HOST_GID" /output'

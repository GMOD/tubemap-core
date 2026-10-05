#!/usr/bin/env bash
# Packs the package, installs the tarball into a scratch dir, and lays out a
# fixture through the ESM and CJS entries. `pnpm test` runs against src/ and
# cannot see the package's shape.

set -euo pipefail

PKG_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SCRATCH="$(mktemp -d)"
trap 'rm -rf "$SCRATCH"' EXIT

cd "$PKG_DIR"
TARBALL="$(npm pack --silent --pack-destination "$SCRATCH")"
FIXTURE="$PKG_DIR/test/fixtures/example-6.json"

cd "$SCRATCH"
cat >package.json <<'JSON'
{
  "name": "tubemap-core-pack-test",
  "version": "0.0.0",
  "private": true,
  "type": "module"
}
JSON
npm install --silent --no-audit --no-fund "./$TARBALL" >/dev/null

cat >smoke.mjs <<JS
import { readFileSync } from 'node:fs'
import { layoutTubeMap, curvePaths } from '@jbrowse/tubemap-core'
const { nodes, tracks, reads } = JSON.parse(readFileSync('$FIXTURE', 'utf8'))
const layout = layoutTubeMap(nodes, tracks, reads)
if (!layout || layout.shapes.rectangles.length === 0) throw new Error('no shapes (ESM)')
if (curvePaths(layout.shapes.curves, 'read').length === 0) throw new Error('no read curves (ESM)')
console.log(\`esm: \${layout.shapes.rectangles.length} rectangles ok\`)
JS

cat >smoke.cjs <<JS
const { readFileSync } = require('node:fs')
const { layoutTubeMap } = require('@jbrowse/tubemap-core')
const { nodes, tracks, reads } = JSON.parse(readFileSync('$FIXTURE', 'utf8'))
const layout = layoutTubeMap(nodes, tracks, reads)
if (!layout || layout.shapes.rectangles.length === 0) throw new Error('no shapes (CJS)')
console.log(\`cjs: \${layout.shapes.rectangles.length} rectangles ok\`)
JS

node smoke.mjs
node smoke.cjs

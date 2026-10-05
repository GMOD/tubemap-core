# @jbrowse/tubemap-core

sequenceTubeMap's layout: graph nodes and paths (and reads) in, tube map shapes
out. No DOM, d3 or React.

```sh
pnpm add @jbrowse/tubemap-core
```

Versions 0.1.0 and 0.2.0 also went out as `@gmod/tubemap-core`, which is
deprecated; install this name instead.

```ts
import {
  curvePaths,
  layoutTubeMap,
  nodeOutlinePath,
} from '@jbrowse/tubemap-core'

const layout = layoutTubeMap(
  [
    { name: '1', seq: 'ACGT' },
    { name: '2', seq: 'A' },
    { name: '3', seq: 'G' },
    { name: '4', seq: 'TTGCA' },
  ],
  [
    { id: 0, name: 'ref', sequence: ['1', '2', '4'], sourceTrackID: 0 },
    { id: 1, name: 'alt', sequence: ['1', '3', '4'], sourceTrackID: 0 },
  ],
  [], // reads
  { nodeWidthOption: 'compressed' },
)
```

- Track 0 is the reference; `-name` is a reverse visit
- A node without `seq` needs `sequenceLength`
- `layout.shapes`: `rectangles`, `curves` (`curvePaths` adds SVG paths),
  `verticalRectangles` and `corners` (inversions)
- Shapes carry no color: each names its track's `id`, and the caller colors it
  from that track in `layout.tracks`, so a recolor needs no new layout
- `nodeOutlinePath(node)`: a node's box as SVG path data; `new Path2D(d)` on a
  canvas
- `layout.nodes` has a hole at index 0: use `forEach` or `filter`, not
  `for...of` or `find`

## Topology and placement

`layoutTubeMap` runs two phases, also exported for running one topology under
several placements:

```ts
const topology = layoutTopology(nodes, tracks, reads, topologyOptions)
const all = placeTubeMap(topology)
const confident = placeTubeMap(topology, { mappingQualityCutoff: 30 })
```

- `layoutTopology` merges, orders, orients and sizes the nodes under the visible
  tracks and every primary read, and fixes each node's x from placing them all
- `placeTubeMap` lays out the haplotypes and the reads its options keep at the
  topology's x positions, so every placement of one topology lines up
- Read filters never move a node; one only a filtered-out read visits keeps its
  place, drawn empty

## Facets

`placeFacets` places one topology once per subset and stacks the panels, each
with an `offsetY`, at the topology's x:

```ts
const { panels, bounds } = placeFacets(topology, { facetBy: 'sample_name' })
```

- `facetBy`: `read_group` or `sample_name` splits the reads and repeats every
  haplotype in each panel; `haplotype_sample` splits the haplotypes by the
  sample in their PanSN names (`parsePanSN`), each panel keeping the reference,
  and draws the reads in a last panel
- `PlacementOptions.facet` places one panel alone, as `placeTubeMap` does
- Without `facetBy`, or with nothing to split, `panels` holds one panel of
  `placeTubeMap`'s layout

## Options

- `nodeWidthOption`: `normal` (default), `compressed`, `small`, `fixed`
- `charWidth`: px per base under `normal` (8.401)
- `trackWidth`: tube width (15)
- `mergeNodes`, `showReads` (true); `coarsenedReadView`, `ignoreStrand` (false)
- `layers`: the track sets placement draws, each with an optional stat.
  `{ data: 'haplotypes', stat: 'coarsen' }` bands every haplotype but the
  reference, one band per edge, and `{ data: 'reads', stat: 'coarsen' }` does
  the same for the reads, which stack under the haplotypes either way. Unset,
  `coarsenedReadView` bands the reads, or the haplotypes when no reads load
- `mappingQualityCutoff`, `focusReadNames`: read filters, the only placement
  options; the rest belong to the topology

`layout.coarsened` holds a `Coarsening` per banded layer, and
`layout.coarsenedEdgeMeta` labels every band by its id, which no two bands
share.

## Development

```sh
pnpm install
pnpm lint
pnpm format:check
pnpm typecheck
pnpm build
pnpm test --run
pnpm test:pack
```

`test/layout.golden.test.ts` pins every shape and node position for the
sequenceTubeMap demo examples and a few bundled graphs, under each option that
picks a different layout path. Its inputs in `test/fixtures` are the nodes,
tracks and reads the viewer hands the layout, and
`scripts/dump-viewer-fixtures.ts` regenerates them from a viewer checkout. After
an intended layout change, `pnpm test --run -u test/layout.golden.test.ts`
rewrites the goldens in `test/layout-golden`.

`CHANGELOG.md` lists the changes in each version.

## Releasing

- `pnpm version <patch|minor|major>` runs the CI checks, bumps `version`, writes
  the changelog with git-cliff, tags `v<version>` and pushes the tag
- `.github/workflows/publish.yml` checks that the tag names the package version,
  tests, and publishes to npm with provenance under trusted publishing, which
  needs no stored token
- A GitHub release follows, its notes taken from `CHANGELOG.md`

## License

MIT

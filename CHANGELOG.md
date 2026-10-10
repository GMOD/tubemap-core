## [0.2.4](https://github.com/GMOD/tubemap-core/compare/v0.2.3...v0.2.4) (2026-10-10)

### Other Changes

- CurvePaths judges steepness at the width a squeezed gap draws, and gives the reference its spread first ([a28d63d](https://github.com/GMOD/tubemap-core/commit/a28d63dfb0efd5ece04be0d73c419a2694faf1c1))

## [0.2.3](https://github.com/GMOD/tubemap-core/compare/v0.2.2...v0.2.3) (2026-10-10)

### Other Changes

- A steep curve's outer edge turns late and its inner edge early, so it keeps its width ([93a9b84](https://github.com/GMOD/tubemap-core/commit/93a9b84255334b68777655f8b2ac104faadeb38d))

## [0.2.2](https://github.com/GMOD/tubemap-core/compare/v0.2.1...v0.2.2) (2026-10-10)

### Other Changes

- 'linear' widens a tube by its freq in whole tubes ([518f125](https://github.com/GMOD/tubemap-core/commit/518f1251cd49321c99fba672b6003c335d102847))

## [0.2.1](https://github.com/GMOD/tubemap-core/compare/v0.2.0...v0.2.1) (2026-10-05)

### Other Changes

- Stand alone as a root package with GMOD tooling ([2385dd6](https://github.com/GMOD/tubemap-core/commit/2385dd643293b21de03e1d39341a8f88504d5f3b))
- Pin layout goldens from fixtures of the viewer's layout inputs ([a89d1e3](https://github.com/GMOD/tubemap-core/commit/a89d1e303be0458a036f28077a22aeeebc8f645a))
- Typecheck under exactOptionalPropertyTypes ([8f6d265](https://github.com/GMOD/tubemap-core/commit/8f6d265e4c55a88e040bf2cac08d56e239ebaa11))
- Pass eslint and prettier ([747fbe0](https://github.com/GMOD/tubemap-core/commit/747fbe0e593793b3cb98b09d55df9e37d1d6fee3))
- Test on push and publish from v* tags with npm trusted publishing ([c41dce9](https://github.com/GMOD/tubemap-core/commit/c41dce959e70ac00a72b110816dacdebb3b88e4a))
- Rename to @jbrowse/tubemap-core and document development and releases ([b91598e](https://github.com/GMOD/tubemap-core/commit/b91598e4b6f6ea562476b5ded43a9ee2e9ba6eae))
- Document what layoutTubeMap returns and how to draw it ([deaaa8d](https://github.com/GMOD/tubemap-core/commit/deaaa8dd07cfd3d84148017794c4b78dc5686795))
- Footnote ([5d3d092](https://github.com/GMOD/tubemap-core/commit/5d3d0920cc06a841e6bfd02d90a21fd78402e6d0))

## [0.2.0](https://github.com/GMOD/tubemap-core/releases/tag/v0.2.0) (2026-10-05)

- First release as `@jbrowse/tubemap-core`; 0.1.0 and 0.2.0 also went out
  as `@gmod/tubemap-core`, now deprecated
- Breaking: shapes no longer carry `color` or `alpha`, and the `trackColor` and
  `trackAlpha` options are gone; color each shape from its track by `id`
- Breaking: `layout.coarsened` is a `Coarsenings` record keyed by layer data,
  not one `Coarsening`
- `layoutTopology` and `placeTubeMap` split the layout in two, and the read
  filters now run at placement
- `layers` bands haplotypes with reads on screen
- `placeFacets` and `parsePanSN` facet by read group, sample or haplotype sample

## [0.1.0](https://www.npmjs.com/package/@gmod/tubemap-core/v/0.1.0) (2026-09-27)

- First release, as `@gmod/tubemap-core` from the sequenceTubeMap viewer's
  `packages/tubemap-core`

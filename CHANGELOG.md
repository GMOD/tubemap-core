## [1.1.0](https://github.com/GMOD/tubemap-core/compare/v1.0.0...v1.1.0) (2026-10-12)

### Documentation

- List what this package adds and fixes relative to upstream ([e748c86](https://github.com/GMOD/tubemap-core/commit/e748c8615e956c31e926df1302cd14c1745c6e88))

### Other Changes

- Grow column gaps with the square root of a lane change's rise ([8be2cec](https://github.com/GMOD/tubemap-core/commit/8be2cec9bd56c2dfa17b005386e0ed2fa224ee75))
- Treat a read segment at y 0 as placed, and find the last band id without spreading ([9724ea3](https://github.com/GMOD/tubemap-core/commit/9724ea38e1811b36744abcc920b6342f8b46c817))
- Size bounds from the drawn shapes, so they hold tube ends and turnarounds ([617a54d](https://github.com/GMOD/tubemap-core/commit/617a54d4c253b85354724aabd622f5e3e1d5db27))

## [1.0.0](https://github.com/GMOD/tubemap-core/compare/v0.2.5...v1.0.0) (2026-10-11)

### Documentation

- Plainer README wording ([bb53568](https://github.com/GMOD/tubemap-core/commit/bb53568fd98061fc1d422867ae38c004b7218efa))
- Break up README walls of text ([c39912a](https://github.com/GMOD/tubemap-core/commit/c39912a05d50abfdb7be00c3abce73ae3ab56e77))

### Other Changes

- README lists ggtubemap among the users ([5c08abd](https://github.com/GMOD/tubemap-core/commit/5c08abd1323f627e403c07fb71374108e14953cf))
- README's see-also lists the graph repos and pangenome tutorials ([f8a80dc](https://github.com/GMOD/tubemap-core/commit/f8a80dcb45db4e7d8ad5dca67911aef3c4a778c7))

## [0.2.5](https://github.com/GMOD/tubemap-core/compare/v0.2.4...v0.2.5) (2026-10-10)

### Other Changes

- Add flattenPath and readMismatches for renderers outside the browser ([ba4f215](https://github.com/GMOD/tubemap-core/commit/ba4f2152baa58c8ea8f982899e72b547f85fdcae))

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

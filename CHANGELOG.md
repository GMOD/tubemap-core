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

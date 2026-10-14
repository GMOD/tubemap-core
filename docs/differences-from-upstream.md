# Differences from upstream sequenceTubeMap

- **Upstream:** `src/util/tubemap.js` in
  [vgteam/sequenceTubeMap](https://github.com/vgteam/sequenceTubeMap), whose
  `master` is still `33b7a7e` (2025-08-21), the commit our viewer fork branched
  from
- **Here:** the layout passes from that file, ported to TypeScript with no DOM
  or d3, and moved out of the viewer fork on 2026-09-26 (`8fc102b`)
- Hashes name commits in this repo; "viewer" marks one in
  [cmdcolin/sequenceTubeMap](https://github.com/cmdcolin/sequenceTubeMap) from
  before the move
- Add an entry when a change makes the layout draw differently from upstream,
  fixes something upstream still gets wrong, or adds API upstream lacks

The viewer's own differences (in-browser `.gbz.db` and GAM reading, the UI,
headless rendering) are in its `doc/differences-from-upstream.md`.

## New in the layout

### Coarsened bands

- The layout draws one band per node-to-node edge instead of one ribbon per
  read, so a view costs O(edges) rather than O(reads); bands go through the
  ordinary read placement (viewer `8ac3c01`)
- `ignoreStrand` merges +A→+B with −B→−A into one band (viewer `8ac3c01`)
- The layout bands haplotypes too, leaving the reference in its lane (`e62f4dc`)
- Banding counts each deduplicated walk `freq` times, so 240 walks standing for
  464 haplotypes label as 464 (`b02c141`)
- Each haplotype band holds its share of the banded haplotypes, counting a walk
  once however often it crosses the edge (`d028e1e`, `364804b`)
- Before banding, the layout turns walks stored back to front to match the
  reference, so reverse bands mark real inversions; MICB-KIR3DL1 goes from 97
  bands to 72 (`b38cd57`)

### Topology, placement and facets

- `layoutTopology` fixes node order and x once; `placeTubeMap` places any subset
  of tracks and reads at those x positions, so read filters never reorder or
  merge nodes (`62e91a6`, `a0be2fc`)
- `layers` bands haplotypes and reads independently (`b1536a8`)
- `placeFacets` stacks one aligned panel per read group, read sample or PanSN
  haplotype sample (`084bc96`, `3fa63a5`)

### Options

- `trackWidth` sets the tube width (`c78fcb8`)
- `freqWidth: 'linear'` makes a walk standing for n haplotypes n tubes wide
  (`518f125`)
- A node may omit `seq`, as the nodes of a graph fetched with `removeSequences`
  do (`2a43357`)

### Output any renderer can draw

- The layout uses no DOM. Upstream measured each node's label with an SVG
  `<text>` element, and the layout multiplies one character width instead
  (viewer `166b9b4`)
- The layout gives each shape its track's id and no color, so recoloring needs
  no new layout (`6972630`)
- `curvePaths`, `nodeOutlinePath`, `flattenPath` and `readMismatches` turn the
  layout into path data, polygons and placed read edits (`ba4f215`)
- `bounds` covers everything drawn, including track ends and turnarounds
  (`617a54d`); upstream keeps no left edge, and takes its right edge from node
  positions alone, which misses turnarounds past the last column

## Layout that draws differently

- Column gaps grow with the square root of a lane change's rise past 35 px, so
  one long jump no longer sets the width of its whole column. The viewer draws
  hprc-chrM 29% narrower as a result (`8be2cec`)
- A steep curve keeps its tube width, because its outer edge turns late and its
  inner edge early; upstream drew a hairline (`93a9b84`)
- `curvePaths({ gapWidth })` judges steepness at the width of a gap in a
  squeezed drawing, and gives the reference curves in a group the spread they
  need before the other curves (`a28d63d`)
- Read placement lets two reads that touch end to start share a row (`+1 <=` in
  place of `+1 <`), so a 1 bp bubble no longer forces a new row (viewer
  `8ac3c01`)

## Upstream bugs fixed here

### Strand and orientation

- The pass that straightens the reference reverse-complements each node it
  turns; upstream only reverses the sequence (`378eaf4`)
- The straightening pass turns reads around with the nodes it turns; upstream
  leaves their reverse visits in place, which produce a double turnaround
  (`497c2d5`)
- A multi-base substitution on a reverse read draws reverse-complemented.
  Upstream reverses its reverse complement, which yields a plain complement
  (vgteam/sequenceTubeMap#71, `a90c91f`)
- A reverse visit's mismatches count from the node's right end (`003693c`), and
  reversing a read flips mismatch positions around `sequenceLength`, not the
  node's pixel `width` (viewer `72f9e82`)
- Merging folds a read's reverse visits along their strand (`2c819b7`)

### Ordering and placement

- Gap curves group by the order slots they span; upstream lumps every gap-to-gap
  curve into one `"null,null"` group and sorts groups on `NaN` (`9357919`)
- The unreachable-node sentinel pass and the order copy-back run here.
  Upstream's `new Array(n)` is all holes, which `forEach` skips, so neither ran
  (viewer `72f9e82`)
- Read comparators are symmetric (viewer `72f9e82`) and order nodeless segments
  transitively (`8cccccd`)
- A read segment at y 0 counts as placed (`9724ea3`)
- Read placement skips nodes without an order, so unreached nodes no longer get
  `contentHeight` NaN (`09b6b73`)

### Crashes and bad values

- `small` gave nodes under 94 bp a width of −8, `compressed` gave an empty node
  −Infinity, and a `freq` of 0 gave a tube −Infinity; widths now stop at 0
  (`f770b10`)
- An input track typed `read` no longer splices the wrong read and crashes lane
  assignment (`0e0eed4`)
- `mergeNodes` accepts a read without `sequenceNew` (`e0131a2`)
- The layout throws naming the track and the unknown node it visits; upstream
  fails later on `undefined` (`2f36cb8`)

## Speed

| Change                                                                                 | Commit                                     |
| -------------------------------------------------------------------------------------- | ------------------------------------------ |
| `Set` lookups replace `indexOf` scans in five passes                                   | viewer `dcd8ad0`                           |
| `placeReads` finds neighbouring segments in O(L), not O(L²)                            | viewer `8a6fc79`                           |
| `isSuccessor` reuses one stamped `Int32Array`                                          | viewer `e75ead5`                           |
| `placeReads` builds each read source's set once per layout: 150 kb MHC 11–22 s → 5–6 s | `ee9a8d3`                                  |
| `mergeNodes` compacts in one pass: 160,000-node chain 3.3 s → 1.0 s                    | `425d2bb`                                  |
| Straightening scans the reference once: reverse 40,000 visits 3.8 s → 0.19 s           | `c495959`                                  |
| Typed arrays, numeric keys and resolved names in the hot passes                        | `7e42d89`, `8039061`, `29a8b36`, `448fc77` |

## Inherited and still open

- `compareTrackByInitialOrdering` returns 0 for two tracks that never meet, so
  the draw-order sort has no consistent total order
- Reads stack inside nodes, so loading reads moves the haplotype nodes below
  them: 17 of 65 on hprc-chrM
- Node orientation votes count reads as well as haplotypes

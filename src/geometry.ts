// SVG path data for the shapes a layout leaves as coordinates: a curve's
// ribbon and a node's rounded outline. Both are strings so the same geometry
// draws as an SVG `d` attribute or, through Path2D, on a canvas.
import type { Node, TrackCurve, TrackType } from './types.ts'

function groupBy<T, K>(items: readonly T[], key: (item: T) => K): Map<K, T[]> {
  const groups = new Map<K, T[]>()
  for (const item of items) {
    const k = key(item)
    const group = groups.get(k)
    if (group === undefined) {
      groups.set(k, [item])
    } else {
      group.push(item)
    }
  }
  return groups
}

function compareCurvesByXYStartValue(a: TrackCurve, b: TrackCurve): number {
  if (a.xStart < b.xStart) {
    return 1
  } else if (a.xStart > b.xStart) {
    return -1
  } else if (a.yStart > b.yStart) {
    return 1
  } else if (a.yStart < b.yStart) {
    return -1
  }
  return 0
}

// Where a curve leaves and enters: a node, or a gap at an order slot
function curveEnds(curve: TrackCurve): [number, number, number, number] {
  return [
    curve.nodeStart ?? -1,
    curve.nodeEnd ?? -1,
    curve.nodeStart === null ? curve.orderStart : -1,
    curve.nodeEnd === null ? curve.orderEnd : -1,
  ]
}

function compareTuples(a: readonly number[], b: readonly number[]): number {
  for (let i = 0; i < a.length; i += 1) {
    const d = a[i]! - b[i]!
    if (d !== 0) {
      return d
    }
  }
  return 0
}

// Where a cubic with both control points at one x is steepest, it is 3/4 of
// the way from the ends' mean x to that control x
const STEEP_SHARE = 0.75
// The most of a gap a group's steep stretch may spread over, so its edges keep
// some of the turn
const MAX_SPREAD = 0.8

// How far apart, as shares of the gap, each curve of a group puts its top and
// bottom edges' control points. A ribbon whose edges turn at one x is only as
// thick across as its width times the cosine of its slope, which on a steep
// lane change is a hairline; with its outer edge turning late and its inner
// edge early, its steep stretch keeps its width, or as much as the gap allows.
// A shallow curve needs none. Groups of more than five keep at least
// sequenceTubeMap's 0.4 in all, which stops their curves crossing at one x.
function spreads(group: readonly TrackCurve[]) {
  const first = group[0]!
  const span = Math.abs(first.xEnd - first.xStart)
  if (span === 0) {
    return group.map(() => 0)
  }
  const floor = group.length > 5 ? 0.4 / group.length : 0
  const wanted = group.map(c => {
    const rise = Math.abs(c.yEnd - c.yStart)
    const across =
      (rise / Math.hypot(rise, span)) *
      Math.min(c.width, MAX_SPREAD * STEEP_SHARE * span)
    return Math.max(floor, across / (STEEP_SHARE * span))
  })
  const total = wanted.reduce((sum, w) => sum + w, 0)
  const scale = total > MAX_SPREAD ? MAX_SPREAD / total : 1
  return wanted.map(w => w * scale)
}

// The curves of one track type in draw order, each with its `path` set. Curves
// between the same pair of nodes, or gaps, form a group whose control points
// fan out top to bottom, so a bundle of tracks changing lanes together stays
// parallel rather than crossing at one x, and each curve's bottom edge is the
// next one's top edge.
export function curvePaths(
  curves: readonly TrackCurve[],
  type: TrackType | undefined,
): TrackCurve[] {
  const groupedCurves = groupBy(
    curves.filter(curve => curve.type === type),
    curve => curveEnds(curve).join(','),
  )

  groupedCurves.forEach(curveGroup => {
    curveGroup.sort(compareCurvesByXYStartValue)
    const spread = spreads(curveGroup)
    // share of the gap at which a boundary between the group's tubes turns,
    // for a curve that rises; one that falls turns at its complement
    let adjustValue = 0.5 - spread.reduce((sum, s) => sum + s, 0) / 2

    curveGroup.forEach((curve, i) => {
      const at = (share: number) =>
        curve.xStart +
        (curve.xEnd - curve.xStart) *
          (curve.yStart < curve.yEnd ? 1 - share : share)
      const xAdjusted = at(adjustValue)
      adjustValue += spread[i]!
      // the bottom edge, on the way back, parallel to the next curve's top
      const xNextAdjusted = at(adjustValue)
      let d = `M ${curve.xStart} ${curve.yStart}`
      d += ` C ${xAdjusted} ${curve.yStart} ${xAdjusted} ${curve.yEnd} ${curve.xEnd} ${curve.yEnd}`
      d += ` V ${curve.yEnd + curve.width}`
      d += ` C ${xNextAdjusted} ${curve.yEnd + curve.width} ${xNextAdjusted} ${
        curve.yStart + curve.width
      } ${curve.xStart} ${curve.yStart + curve.width}`
      d += ' Z'
      curve.path = d
    })
  })

  // One flat list ordered by group, then by the within-group sort
  return [...groupedCurves.values()]
    .sort((a, b) => compareTuples(curveEnds(a[0]!), curveEnds(b[0]!)))
    .flat()
}

// A node's outline: a rounded box 9 units outside the node's x extent and its
// content height, the tracks through it inside.
export function nodeOutlinePath(node: Node): string {
  // top left arc
  let d = `M ${node.x - 9} ${node.y} Q ${node.x - 9} ${node.y - 9} ${
    node.x
  } ${node.y - 9}`
  let x = node.x
  let y = node.y - 9

  // top straight
  if (node.width > 1) {
    x += node.pixelWidth
    d += ` L ${x} ${y}`
  }

  // top right arc
  d += ` Q ${x + 9} ${y} ${x + 9} ${y + 9}`
  x += 9
  y += 9

  // right straight
  if (node.contentHeight > 0) {
    y += node.contentHeight
    d += ` L ${x} ${y}`
  }

  // bottom right arc
  d += ` Q ${x} ${y + 9} ${x - 9} ${y + 9}`
  x -= 9
  y += 9

  // bottom straight
  if (node.width > 1) {
    x -= node.pixelWidth
    d += ` L ${x} ${y}`
  }

  // bottom left arc
  d += ` Q ${x - 9} ${y} ${x - 9} ${y - 9}`
  x -= 9
  y -= 9

  // left straight
  if (node.contentHeight > 0) {
    y -= node.contentHeight
    d += ` L ${x} ${y}`
  }
  return d
}

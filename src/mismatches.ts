import {
  forward,
  getXCoordinateOfBaseWithinNode,
  mirroredMismatch,
} from './layout.ts'

import type { TubeMapLayout } from './layout.ts'
import type { MismatchType } from './types.ts'

// One edit of a read against the node it visits, placed in layout pixels. `x`
// is the left edge of the edit's first base (an insertion's point), `xEnd` the
// right edge of its last, and `y` the top of the read's tube.
export interface ReadMismatch {
  type: MismatchType
  readId: number
  x: number
  xEnd: number
  y: number
  height: number
  nodeY: number
  // the substituted bases, as read along the forward strand
  seq?: string | undefined
  // an insertion at the read's first or last base
  softClip: boolean
}

export function readMismatches(layout: TubeMapLayout): ReadMismatch[] {
  const { nodes, nodeMap } = layout
  const out: ReadMismatch[] = []
  for (const read of layout.tracks) {
    const entries = read.sequenceNew
    if (read.type !== 'read' || entries === undefined) {
      continue
    }
    entries.forEach((entry, i) => {
      const nodeIndex = nodeMap.get(forward(entry.nodeName))
      const node = nodeIndex === undefined ? undefined : nodes[nodeIndex]
      // node merging can drop a visit, so the walk stops at the path's end
      let pathIndex = i
      while (
        pathIndex < read.path.length &&
        read.path[pathIndex]!.node !== nodeIndex
      ) {
        pathIndex += 1
      }
      const segment = read.path[pathIndex]
      if (node === undefined || segment?.y === undefined) {
        return
      }
      for (const edit of entry.mismatches) {
        // vg counts a reverse visit's positions from the node's right end
        const mm = segment.isForward
          ? edit
          : mirroredMismatch(edit, node.sequenceLength)
        const span =
          mm.type === 'deletion'
            ? mm.length
            : mm.type === 'substitution'
              ? mm.seq?.length
              : 0
        if (span === undefined) {
          continue
        }
        const x = getXCoordinateOfBaseWithinNode(node, mm.pos)
        const xEnd = getXCoordinateOfBaseWithinNode(node, mm.pos + span)
        if (x === null || xEnd === null) {
          continue
        }
        out.push({
          type: mm.type,
          readId: read.id,
          x,
          xEnd,
          y: segment.y,
          height: read.width,
          nodeY: node.y,
          seq: mm.seq,
          softClip:
            mm.type === 'insertion' &&
            ((i === 0 && edit.pos === read.firstNodeOffset) ||
              (i === entries.length - 1 &&
                edit.pos === read.finalNodeCoverLength)),
        })
      }
    })
  }
  return out
}

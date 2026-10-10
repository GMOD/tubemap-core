import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import { layoutTubeMap } from '../src/layout.ts'
import { readMismatches } from '../src/mismatches.ts'

import type { InputNode, InputTrack, Mismatch } from '../src/types.ts'

const nodes: InputNode[] = [
  { name: '1', seq: 'ACGT' },
  { name: '2', seq: 'A' },
  { name: '3', seq: 'G' },
  { name: '4', seq: 'TTGCA' },
]
const tracks: InputTrack[] = [
  { id: 0, name: 'ref', sequence: ['1', '2', '4'], sourceTrackID: 0 },
  { id: 1, name: 'alt', sequence: ['1', '3', '4'], sourceTrackID: 0 },
]

const edits: Mismatch[] = [
  { type: 'substitution', pos: 1, seq: 'C' },
  { type: 'deletion', pos: 3, length: 2 },
  { type: 'insertion', pos: 5, seq: 'AA' },
]

function readThrough4(sequence: string[]): InputTrack {
  return {
    id: 0,
    name: 'r1',
    type: 'read',
    sequence,
    sourceTrackID: 1,
    firstNodeOffset: 0,
    finalNodeCoverLength: 5,
    sequenceNew: [
      { nodeName: sequence[0]!, mismatches: [] },
      { nodeName: sequence[1]!, mismatches: edits },
    ],
  }
}

function layoutWith(read: InputTrack) {
  const layout = layoutTubeMap(nodes, tracks, [read], { mergeNodes: false })!
  const node4 = layout.nodes[layout.nodeMap.get('4')!]!
  // a node's bases span 4px past its x extent on each side
  const base = (pos: number) => node4.x - 4 + (pos / 5) * (node4.pixelWidth + 8)
  return { layout, node4, base }
}

describe('readMismatches', () => {
  it('places each edit at its bases within the node, on the read', () => {
    const { layout, node4, base } = layoutWith(readThrough4(['1', '4']))
    const [sub, del, ins] = readMismatches(layout)
    expect(sub).toMatchObject({ type: 'substitution', seq: 'C' })
    expect(sub!.x).toBeCloseTo(base(1))
    expect(sub!.xEnd).toBeCloseTo(base(2))
    expect(del!.x).toBeCloseTo(base(3))
    expect(del!.xEnd).toBeCloseTo(base(5))
    expect(ins).toMatchObject({ type: 'insertion', softClip: true })
    expect(ins!.x).toBeCloseTo(base(5))
    const visit = layout.reads[0]!.path.find(
      s => s.node === layout.nodeMap.get('4'),
    )
    expect(sub!.y).toBe(visit!.y)
    expect(sub!.nodeY).toBe(node4.y)
    expect(sub!.height).toBe(layout.reads[0]!.width)
  })

  it('counts a reverse visit from the node’s right end', () => {
    const { layout, base } = layoutWith(readThrough4(['1', '-4']))
    const visit = layout.reads[0]!.path.find(
      s => s.node === layout.nodeMap.get('4'),
    )
    expect(visit?.isForward).toBe(false)
    const [sub, del] = readMismatches(layout)
    expect(sub).toMatchObject({ type: 'substitution', seq: 'G' })
    expect(sub!.x).toBeCloseTo(base(3))
    expect(del!.x).toBeCloseTo(base(0))
    expect(del!.xEnd).toBeCloseTo(base(2))
  })

  it('places every brca1 read edit inside its node', () => {
    const fixture = JSON.parse(
      readFileSync(new URL('fixtures/brca1.json', import.meta.url), 'utf8'),
    ) as { nodes: InputNode[]; tracks: InputTrack[]; reads: InputTrack[] }
    const layout = layoutTubeMap(fixture.nodes, fixture.tracks, fixture.reads)!
    const placed = readMismatches(layout)
    expect(placed.length).toBeGreaterThan(0)
    const extents = layout.nodes.flatMap(n => [
      { y: n.y, left: n.x - 4, right: n.x + n.pixelWidth + 4 },
    ])
    for (const m of placed) {
      const inside = extents.some(
        n =>
          n.y === m.nodeY && m.x >= n.left - 1e-9 && m.xEnd <= n.right + 1e-9,
      )
      expect(inside).toBe(true)
      expect(m.xEnd).toBeGreaterThanOrEqual(m.x)
    }
  })
})

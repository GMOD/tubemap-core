import { describe, expect, it } from 'vitest'

import { curvePaths, flattenPath, nodeOutlinePath } from '../src/geometry.ts'
import { layoutTubeMap } from '../src/layout.ts'

import type { InputNode, InputTrack } from '../src/types.ts'

const nodes: InputNode[] = [
  { name: '1', seq: 'ACGT' },
  { name: '2', seq: 'A' },
  { name: '3', seq: 'G' },
  { name: '4', seq: 'TTGCA' },
]
const tracks: InputTrack[] = [
  { id: 0, name: 'ref', sequence: ['1', '2', '4'], sourceTrackID: 0 },
  { id: 1, name: 'alt', sequence: ['1', '-3', '4'], sourceTrackID: 0 },
  // turns back through 1, which draws corners
  { id: 2, name: 'inv', sequence: ['1', '2', '-1'], sourceTrackID: 0 },
]

describe('flattenPath', () => {
  it('keeps straight segments as their corners', () => {
    expect(flattenPath('M 0 0 H 10 V 5 L 0 5 Z')).toEqual([
      [0, 0],
      [10, 0],
      [10, 5],
      [0, 5],
    ])
  })

  it('splits a Bézier into the asked steps, ending on its end point', () => {
    const points = flattenPath('M 0 0 C 5 0 5 10 10 10', 4)
    expect(points).toHaveLength(5)
    expect(points[2]).toEqual([5, 5])
    expect(points.at(-1)).toEqual([10, 10])
    expect(flattenPath('M 0 0 Q 10 0 10 10', 2)).toEqual([
      [0, 0],
      [7.5, 2.5],
      [10, 10],
    ])
  })

  it('reads exponents and negative coordinates', () => {
    expect(flattenPath('M -1.5e-3 -2 L .5 3')).toEqual([
      [-0.0015, -2],
      [0.5, 3],
    ])
  })

  it('flattens every curve, corner and node outline a layout makes', () => {
    const layout = layoutTubeMap(nodes, tracks)!
    const paths = [
      ...curvePaths(layout.shapes.curves, 'haplotype').map(c => c.path!),
      ...layout.shapes.corners.map(c => c.path),
    ]
    layout.nodes.forEach(node => paths.push(nodeOutlinePath(node)))
    expect(layout.shapes.corners.length).toBeGreaterThan(0)
    for (const d of paths) {
      const points = flattenPath(d)
      expect(points.length).toBeGreaterThan(2)
      expect(points.flat().every(Number.isFinite)).toBe(true)
    }
  })

  it('rejects a command it does not draw', () => {
    expect(() => flattenPath('M 0 0 A 1 1 0 0 1 2 2')).toThrow(/A/)
  })
})

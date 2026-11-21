import { expect, test } from 'vitest'

import {
  FORWARD_READ_COLORS,
  REVERSE_READ_COLORS,
  readColor,
} from '../src/index.ts'

test('a forward read is red and a reverse read blue, as JBrowse colours strands', () => {
  expect(readColor({ id: 0 })).toBe('#fb6a4a')
  expect(readColor({ id: 0, is_reverse: true })).toBe('#6baed6')
})

test('neighbouring reads of a strand take the next shade, round the ramp', () => {
  expect([0, 1, 2, 3, 4].map(id => readColor({ id }))).toEqual([
    ...FORWARD_READ_COLORS,
    FORWARD_READ_COLORS[0],
  ])
  expect([5, 6].map(id => readColor({ id, is_reverse: true }))).toEqual([
    REVERSE_READ_COLORS[1],
    REVERSE_READ_COLORS[2],
  ])
})

test('the ramps are frozen, so no reader changes them for another', () => {
  expect(Object.isFrozen(FORWARD_READ_COLORS)).toBe(true)
  expect(Object.isFrozen(REVERSE_READ_COLORS)).toBe(true)
})

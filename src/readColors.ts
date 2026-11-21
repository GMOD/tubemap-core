// Forward reads in reds and reverse reads in blues, as JBrowse's alignments
// track colours strands, darkening along each ramp so neighbouring reads differ
export const FORWARD_READ_COLORS = Object.freeze([
  '#fb6a4a',
  '#ef3b2c',
  '#cb181d',
  '#a50f15',
])
export const REVERSE_READ_COLORS = Object.freeze([
  '#6baed6',
  '#4292c6',
  '#2171b5',
  '#08519c',
])

export function readColor(read: { id: number; is_reverse?: boolean }) {
  const colors = read.is_reverse ? REVERSE_READ_COLORS : FORWARD_READ_COLORS
  return colors[read.id % colors.length]!
}

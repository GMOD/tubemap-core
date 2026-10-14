export function groupBy<T, K>(
  items: readonly T[],
  key: (item: T) => K,
): Map<K, T[]> {
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

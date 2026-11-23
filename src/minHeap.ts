// A binary min-heap of items by a key that must not change while an item is in
// the heap
export class MinHeap<T> {
  private items: T[] = []
  private key: (item: T) => number

  constructor(key: (item: T) => number) {
    this.key = key
  }

  get size() {
    return this.items.length
  }

  push(item: T) {
    const { items, key } = this
    let i = items.length
    items.push(item)
    while (i > 0 && key(items[(i - 1) >> 1]!) > key(item)) {
      items[i] = items[(i - 1) >> 1]!
      i = (i - 1) >> 1
    }
    items[i] = item
  }

  pop(): T | undefined {
    const { items, key } = this
    const top = items[0]
    const last = items.pop()
    if (items.length > 0 && last !== undefined) {
      let i = 0
      let child = this.lesserChild(0)
      while (child !== undefined && key(items[child]!) < key(last)) {
        items[i] = items[child]!
        i = child
        child = this.lesserChild(i)
      }
      items[i] = last
    }
    return top
  }

  private lesserChild(i: number) {
    const { items, key } = this
    const left = 2 * i + 1
    const right = left + 1
    return left >= items.length
      ? undefined
      : right < items.length && key(items[right]!) < key(items[left]!)
        ? right
        : left
  }
}

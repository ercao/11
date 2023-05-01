import { randomInt } from 'crypto'
import { times } from 'moderndash'
import { LRU } from 'src/workers/LRU.ts'
import { HeapPlus } from 'src/heapPlus.ts'
import { compare, genArray } from 'src/utils.ts'

/** 使用加强堆 */
class Right {
  private _heap = new HeapPlus<{ page: number; time: number }, number>(
    (node) => node.page,
    (n1, n2) => compare(n2.time, n1.time) // 需要小根堆
  )

  private _time = 0 // 时间戳精度不够

  public constructor(private _capacity: number) {}

  // 是否存在这个
  public get(page: number): boolean {
    return this._heap.indexOf(page) !== undefined
  }

  /**
   * 请求页
   * @returns 是否缺页
   */
  public put(page: number): boolean {
    if (this._capacity < 1) return true

    const index = this._heap.indexOf(page)

    const time = this._time++

    if (index === undefined) {
      if (this._heap.length >= this._capacity) {
        this._heap.remove(0) // 删掉栈顶
      }

      this._heap.add({ page, time })
      return true
    } else {
      this._heap.replace({ page, time }, index)
      return false
    }
  }
}

const [time, min, max, maxLength] = [100, 0, 10, 25]
test('LRU 算法', () => {
  times(() => {
    const pages = genArray(min, max, maxLength)
    const capacity = randomInt(0, maxLength)

    const lru = new LRU(capacity)
    const lru2 = new Right(capacity)

    for (let i = 0; i < pages.length; ++i) {
      lru.put(pages[i])
      lru2.put(pages[i])

      for (let j = 0; j <= i; ++j) {
        expect(lru.get(pages[j])).toBe(lru2.get(pages[j]))
      }
    }
  }, time)
})

import { randomInt } from 'crypto'
import { times } from 'moderndash'
import { LFU } from 'src/workers/LFU.ts'
import { HeapPlus } from 'src/HeapPlus.ts'
import { compare, genArray } from 'src/utils.ts'

/**
 * 使用加强堆
 */
class Right {
  private _heap = new HeapPlus<
    { page: number; freq: number; time: number },
    number
  >(
    (node) => node.page,
    (n1, n2) => {
      const cmp = compare(n2.freq, n1.freq)
      return cmp === 0 ? compare(n2.time, n1.time) : cmp
    }
  )

  private _time = 0

  public constructor(private _capacity: number) {}

  /** 是否存在 */
  public get(page: number): { page: number; freq: number } | undefined {
    const index = this._heap.indexOf(page)
    if (index === undefined) return undefined

    const node = this._heap.get(index)
    return { page: node.page, freq: node.freq }
  }

  /**
   * 请求页面
   * @returns 是否缺页
   */
  public put(page: number): boolean {
    if (this._capacity < 1) return true

    const index = this._heap.indexOf(page)

    const time = this._time++
    if (index === undefined) {
      // 不出来在
      if (this._heap.length >= this._capacity) {
        this._heap.remove(0)
      }

      this._heap.add({ page, freq: 1, time })

      return true
    } else {
      const node = this._heap.get(index)!
      this._heap.replace({ page: node.page, freq: node.freq + 1, time }, index)

      return false
    }
  }
}

const [time, min, max, maxLength] = [100, 0, 10, 50]
test('LFU 算法', () => {
  times(() => {
    const pages = genArray(min, max, maxLength)
    const capacity = 3

    const lfu = new LFU(capacity)
    const lfu2 = new Right(capacity)

    for (let i = 0; i < pages.length; ++i) {
      lfu.put(pages[i])
      lfu2.put(pages[i])

      for (let j = 0; j <= i; ++j) {
        expect(lfu.get(pages[j])).toEqual(lfu2.get(pages[j]))
      }
    }
  }, time)
})

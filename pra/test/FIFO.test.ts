import { randomInt } from 'crypto'
import { times } from 'moderndash'
import { HeapPlus } from 'src/HeapPlus.ts'
import { compare, genArray } from 'src/utils.ts'
import { FIFO } from 'src/workers/FIFO.ts'
import { LRU } from 'src/workers/LRU.ts'

/** 使用加强堆 */
class Right {
  private _heap = new HeapPlus<{ page: number; time: number }, number>(
    (node) => node.page,
    (n1, n2) => compare(n2.time, n1.time) // 需要小根堆
  )

  private _time = 0 // 时间戳精度不够

  public constructor(private _capacity: number) {}

  // 是否存在这个
  public contain(page: number): boolean {
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

    if (index !== undefined) return false

    if (this._heap.length >= this._capacity) {
      this._heap.remove(0) // 删掉栈顶
    }
    this._heap.add({ page, time })
    return true
  }
}

const [time, min, max, maxLength] = [100, 0, 10, 50]
test('FIFO 算法', () => {
  times(() => {
    const pages = genArray(min, max, maxLength)
    const capacity = 3

    const fifo = new FIFO(capacity)
    const fifo2 = new Right(capacity)

    for (let i = 0; i < pages.length; ++i) {
      fifo.put(pages[i])
      fifo2.put(pages[i])

      for (let j = 0; j <= i; ++j) {
        // console.log(lru.toArray(), lru['_size'], lru['_capacity'])
        // console.log(lru2['_heap'], lru2['_heap'].length, lru['_capacity'])

        // console.log('----------')
        expect(fifo.contain(pages[j])).toBe(fifo2.contain(pages[j]))
      }
    }
  }, time)
})

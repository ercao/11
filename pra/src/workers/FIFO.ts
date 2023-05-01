//
// 先进先出算法：每次选择淘汰的页面是最早进入内存的页面
//

import { RequestType, ResponseType } from 'src/utils.ts'
import { parentPort } from 'worker_threads'

parentPort?.on('message', <T>(req: RequestType<T>) => {
  const res: ResponseType<T>['res'] = []

  if (req.capacity > 0) {
    const fifo = new FIFO<T>(req.capacity)

    for (const page of req.pages) {
      const flag = fifo.put(page)

      res.push({ request: page, pages: fifo['_pages'].slice(), flag })
    }
  }

  parentPort?.postMessage({ name: 'FIFO 算法', req, res })
})

/**
 * 使用队列实现
 */
export class FIFO<T> {
  // 页号数组
  private _cache = new Set<T>()
  private _pages: T[]

  constructor(private _capacity: number = 10) {
    this._pages = new Array()
  }

  /**
   * 请求页面
   * @returns 是否缺页
   */
  public put(page: T): boolean {
    if (this._capacity < 1) return true

    if (this._cache.has(page)) {
      return false
    }

    if (this._pages.length >= this._capacity) {
      this._cache.delete(this._pages.shift()!)
    }
    this._pages.push(page)
    this._cache.add(page)
    return true
  }
}

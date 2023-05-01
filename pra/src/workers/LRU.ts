//
// 最近最久未使用原则： 每次淘汰的页面是最久未使用的牙面
//

import { RequestType, ResponseType } from 'src/utils.ts'
import { parentPort } from 'worker_threads'

parentPort?.on('message', <T>(req: RequestType<T>) => {
  const res: ResponseType<T>['res'] = []

  if (req.capacity > 0) {
    const lru = new LRU<T>(req.capacity)

    for (const page of req.pages) {
      const flag = lru.put(page)

      res.push({
        request: page,
        pages: lru.toArray().map(({ page }) => page),
        flag,
      })
    }
  }

  parentPort?.postMessage({ name: 'LRU 算法', req, res })
})

/**
 * HashMap 和 一条双向链表
 */
export class LRU<T> {
  private _cache = new Map<T, Node<T>>()

  private _head: any = {}
  private _tail: any = {}
  private _size = 0

  private _time = 0

  constructor(private _capacity: number) {
    this._head.next = this._tail
    this._tail.prev = this._head
  }

  /**
   * 是否存在该页 (不会造成频率增加)
   */
  public get(page: T): boolean {
    return this._cache.get(page) !== undefined
  }

  /**
   * 请求页
   * @returns 是否缺页
   */
  public put(page: T): boolean {
    if (this._capacity < 1) return true

    let node = this._cache.get(page)

    const time = this._time++
    if (!node) {
      // 不存在添加
      node = new Node(page, time, this._tail.prev, this._tail)
      this._tail.prev.next = node
      this._tail.prev = node
      this._cache.set(page, node)
      ++this._size

      if (this._size > this._capacity) {
        // 删除第一个元素
        this._cache.delete(this._head.next.page)
        this._head.next.next.prev = this._head
        this._head.next = this._head.next.next
      }

      return true
    } else {
      // 从链表中删除该元素
      node.next.prev = node.prev
      node.prev.next = node.next

      // 移动到结尾
      node.next = this._tail
      node.prev = this._tail.prev
      this._tail.prev.next = node
      this._tail.prev = node
      node.time = time

      return false
    }
  }

  public toArray(): { page: T; time: number }[] {
    const pages: { page: T; time: number }[] = []
    let node = this._head.next as Node<T>

    while (node !== this._tail) {
      pages.push({ page: node.page, time: node.time })
      node = node.next
    }

    return pages
  }
}

class Node<T> {
  constructor(
    public page: T,
    public time: number,
    public prev: Node<T>,
    public next: Node<T>
  ) {}
}

//
// 最近最久未使用原则： 每次淘汰的页面是最久未使用的牙面
//

import { Strategy } from '../Strategy.ts'
import { QUICK_TABLE_SIZE } from '../config.ts'
import { QuickTable } from '../quickTable.ts'
import { RequestType, run } from '../utils.ts'
import { parentPort } from 'worker_threads'

parentPort?.on('message', <T>(req: RequestType<T>) => {
  parentPort?.postMessage({
    name: 'LRU 算法',
    req,
    ...run(
      new LRU(req.capacity),
      new QuickTable(new LRU(QUICK_TABLE_SIZE)),
      req
    ),
  })
})

/**
 * HashMap 和 一条双向链表
 */
export class LRU<T> implements Strategy<T> {
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

  public contain(page: T): boolean {
    return this._cache.has(page)
  }

  public put(page: T): { swap?: T; flag: boolean } {
    let swap: T | undefined
    let flag = true

    if (this._capacity < 1) return { flag }

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
        const first = this._head.next as Node<T>
        this._cache.delete(first.page)
        first.next.prev = first.prev
        this._head.next = first.next

        swap = first.page
      }
    } else {
      flag = false

      // 从链表中删除该元素
      node.next.prev = node.prev
      node.prev.next = node.next

      // 移动到结尾
      node.next = this._tail
      node.prev = this._tail.prev
      this._tail.prev.next = node
      this._tail.prev = node
      node.time = time
    }

    return { swap, flag }
  }

  public toArray(): T[] {
    const pages: T[] = []
    let node = this._head.next as Node<T>

    while (node !== this._tail) {
      pages.push(node.page)
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

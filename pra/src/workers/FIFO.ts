//
// 先进先出算法：每次选择淘汰的页面是最早进入内存的页面
//

import { Strategy } from '..//Strategy.ts'
import { QUICK_TABLE_SIZE } from '..//config.ts'
import { QuickTable } from '../quickTable.ts'
import { RequestType, run } from '../utils.ts'
import { parentPort } from 'worker_threads'

parentPort?.on('message', <T>(req: RequestType<T>) => {
  parentPort?.postMessage({
    name: 'FIFO 算法',
    req,
    ...run(
      new FIFO(req.capacity),
      new QuickTable(new FIFO(QUICK_TABLE_SIZE)),
      req
    ),
  })
})

/**
 * 使用队列实现
 */
export class FIFO<T> implements Strategy<T> {
  // 页号数组
  private _cache = new Set<T>()
  private _head: any = {}
  private _tail: any = {}
  private _size = 0

  constructor(private _capacity: number = 10) {
    this._head.next = this._tail
    this._tail.prev = this._head
  }

  public contain(page: T): boolean {
    return this._cache.has(page)
  }

  public put(page: T): { swap?: T; flag: boolean } {
    let swap: T | undefined
    let flag = true

    if (this._capacity < 1) return { flag }

    if (this._cache.has(page)) {
      return { flag: false }
    }

    if (this._size >= this._capacity) {
      // 删除头节点
      const first = this._head.next as Node<T>
      first.next.prev = this._head
      this._head.next = first.next

      this._cache.delete(first.page)

      swap = first.page
    } else {
      ++this._size
    }

    this._cache.add(page)

    // 添加到结尾
    const newNode = new Node(page, this._tail.prev, this._tail)
    this._tail.prev.next = newNode
    this._tail.prev = newNode

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

/** 链表节点 */
class Node<T> {
  public constructor(
    public page: T,
    public prev: Node<T>,
    public next: Node<T>
  ) {}
}

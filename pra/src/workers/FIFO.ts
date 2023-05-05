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

      res.push({ request: page, pages: fifo.toArray(), flag })
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
  private _head: any = {}
  private _tail: any = {}
  private _size = 0

  constructor(private _capacity: number = 10) {
    this._head.next = this._tail
    this._tail.prev = this._head
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

    if (this._size >= this._capacity) {
      // 删除头节点
      const node = this._head.next as Node<T>
      node.next.prev = this._head
      this._head.next = node.next

      this._cache.delete(node.page)
    } else {
      ++this._size
    }

    this._cache.add(page)

    // 添加到结尾
    const newNode = new Node(page, this._tail.prev, this._tail)
    this._tail.prev.next = newNode
    this._tail.prev = newNode

    return true
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

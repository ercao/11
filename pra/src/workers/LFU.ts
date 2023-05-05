//
// 最少使用：淘汰一段时间内，使用次数最少的页面
//

import { RequestType, ResponseType } from 'src/utils.ts'
import { parentPort } from 'worker_threads'

parentPort?.on('message', <T>(req: RequestType<T>) => {
  const res: ResponseType<T>['res'] = []

  if (req.capacity > 0) {
    const lru = new LFU<T>(req.capacity)

    for (const page of req.pages) {
      const flag = lru.put(page)

      res.push({
        request: page,
        pages: lru.toArray().map(({ page }) => page),
        flag,
      })
    }
  }

  parentPort?.postMessage({ name: 'LFU 算法', req, res })
})

/**
 * 使用 一个 HashMap 和 一条双向链表
 * 双向链表的每一个节点节点 都是一条具有相同频率的页面节点
 */
export class LFU<T> {
  private _cache = new Map<T, Node<T>>()
  private _head: any = {}
  private _tail: any = {}
  private _size = 0

  public constructor(private _capacity: number) {
    this._head.next = this._tail
    this._tail.prev = this._head
  }

  /**
   * 是否存在该页
   */
  public get(page: T): { page: T; freq: number } | undefined {
    const node = this._cache.get(page)
    if (node === undefined) return undefined

    return { page: node.page, freq: node.list.freq }
  }

  /**
   * 访问一个新页面
   * @returns 是否缺页
   */
  public put(page: T): boolean {
    if (this._capacity < 1) return true

    let node = this._cache.get(page)
    if (!node) {
      if (this._size >= this._capacity) {
        // 换出
        const firstList = this._head.next as DoublyLinkedList<T>
        this._cache.delete(firstList.removeFirstNode())

        --this._size
        this.checkAndRemoveEmptyList(firstList)
      }

      // 添加
      let firstList = this._head.next as DoublyLinkedList<T>
      if (this._size < 1 || firstList.freq > 1) {
        firstList = this.addDoublyLinkedList(1, this._head, firstList)
      }

      this._cache.set(page, firstList.addLastNode(page))
      ++this._size

      return true
    } else {
      // 存在这个节点需要增加频率
      const list = node.list
      let nextList = list.next

      if (nextList === this._tail || nextList.freq > list.freq + 1) {
        nextList = this.addDoublyLinkedList(list.freq + 1, list, nextList)
      }
      this._cache.set(page, nextList.addLastNode(page))

      list.removeNode(node)
      this.checkAndRemoveEmptyList(list)

      return false
    }
  }

  /** 转换为数组 */
  public toArray(): { page: T; freq: number }[] {
    const pages: { page: T; freq: number }[] = []

    let list = this._head.next as DoublyLinkedList<T>

    while (list !== this._tail) {
      let node = list.head.next as Node<T>
      while (node !== list.tail) {
        pages.push({ page: node.page, freq: node.list.freq })
        node = node.next
      }
      list = list.next
    }

    return pages
  }

  /** 检查并删除一个双向链表 */
  private checkAndRemoveEmptyList(list: DoublyLinkedList<T>): void {
    if (list.head.next === list.tail) {
      list.prev.next = list.next
      list.next.prev = list.prev
    }
  }

  /**
   * 添加一个双向链表
   */
  private addDoublyLinkedList(
    freq: number,
    prev: DoublyLinkedList<T>,
    next: DoublyLinkedList<T>
  ): DoublyLinkedList<T> {
    const list = new DoublyLinkedList(freq, prev, next)
    prev.next = list
    next.prev = list

    return list
  }
}

class Node<T> {
  constructor(
    public page: T,
    public prev: Node<T>,
    public next: Node<T>,
    public list: DoublyLinkedList<T>
  ) {}
}

class DoublyLinkedList<T> {
  public head: any = {}
  public tail: any = {}

  public constructor(
    public freq: number,
    public prev: DoublyLinkedList<T>,
    public next: DoublyLinkedList<T>
  ) {
    this.head.next = this.tail
    this.tail.prev = this.head
  }

  // 删除第一个节点
  public removeFirstNode(): T {
    return this.removeNode(this.head.next)
  }

  // 删除节点
  public removeNode(node: Node<T>): T {
    node.prev.next = node.next
    node.next.prev = node.prev

    return node.page
  }

  // 结尾处添加节点
  public addLastNode(page: T): Node<T> {
    const node = new Node(page, this.tail.prev, this.tail, this)
    node.prev.next = node
    this.tail.prev = node

    return node
  }
}

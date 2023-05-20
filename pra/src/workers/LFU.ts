//
// 最少使用：淘汰一段时间内，使用次数最少的页面
//

import { Strategy } from '../Strategy.ts'
import { QUICK_TABLE_SIZE } from '../config.ts'
import { QuickTable } from '../quickTable.ts'
import { RequestType, run } from '../utils.ts'
import { parentPort } from 'worker_threads'

parentPort?.on('message', <T>(req: RequestType<T>) => {
  parentPort?.postMessage({
    name: 'LFU 算法',
    req,
    ...run(
      new LFU(req.capacity),
      new QuickTable(new LFU(QUICK_TABLE_SIZE)),
      req
    ),
  })
})

/**
 * 使用 一个 HashMap 和 一条双向链表
 * 双向链表的每一个节点节点 都是一条具有相同频率的页面节点
 */
export class LFU<T> implements Strategy<T> {
  private _cache = new Map<T, Node<T>>()
  private _head: any = {}
  private _tail: any = {}
  private _size = 0

  public constructor(private _capacity: number) {
    this._head.next = this._tail
    this._tail.prev = this._head
  }

  /** 获取该页 */
  public get(page: T): { page: T; freq: number } | undefined {
    const node = this._cache.get(page)
    if (node === undefined) return undefined

    return { page: node.page, freq: node.list.freq }
  }

  public contain(page: T): boolean {
    return this._cache.has(page)
  }

  public put(page: T): { swap?: T; flag: boolean } {
    let swap: T | undefined
    let flag = true

    if (this._capacity < 1) return { flag }

    let node = this._cache.get(page)
    if (!node) {
      if (this._size >= this._capacity) {
        // 换出
        const firstList = this._head.next as DoublyLinkedList<T>
        swap = firstList.removeFirstNode()
        this._cache.delete(swap)

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
    } else {
      flag = false

      // 存在这个节点需要增加频率
      const list = node.list
      let nextList = list.next

      if (nextList === this._tail || nextList.freq > list.freq + 1) {
        nextList = this.addDoublyLinkedList(list.freq + 1, list, nextList)
      }
      this._cache.set(page, nextList.addLastNode(page))

      list.removeNode(node)
      this.checkAndRemoveEmptyList(list)
    }

    return { swap, flag }
  }

  /** 转换为数组 */
  public toArray(): T[] {
    const pages: T[] = []

    let list = this._head.next as DoublyLinkedList<T>

    while (list !== this._tail) {
      let node = list.head.next as Node<T>
      while (node !== list.tail) {
        pages.push(node.page)
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

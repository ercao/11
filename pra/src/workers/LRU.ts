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
 * 访问时间是一个隐式属性
 */
export class LRU<T> implements Strategy<T> {
  private _cache = new Map<T, Node<T>>() // 绑定页面与链表节点 --- 加速查询

  private _head: any = {} // 链表头节点
  private _tail: any = {} // 链表尾节点
  private _size = 0 // 链表节点数量

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

    if (!node) {
      // 内存中不存在该页面的分支
      if (this._size >= this._capacity) {
        // 需要换出页面 --- 删除链表第一个节点
        const first = this._head.next as Node<T>
        this._cache.delete(first.page)
        first.next.prev = first.prev
        this._head.next = first.next

        swap = first.page
      } else {
        ++this._size
      }

      // 在链表的尾部添加该页面
      node = new Node(page, this._tail.prev, this._tail)
      this._tail.prev.next = node
      this._tail.prev = node
      this._cache.set(page, node)
    } else {
      // 存在该页面就将该页面节点移动到链表尾部
      flag = false

      // 从链表中删除该元素
      node.next.prev = node.prev
      node.prev.next = node.next

      // 移动到结尾
      node.next = this._tail
      node.prev = this._tail.prev
      this._tail.prev.next = node
      this._tail.prev = node
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
    //
    public page: T,
    public prev: Node<T>,
    public next: Node<T>
  ) {}
}

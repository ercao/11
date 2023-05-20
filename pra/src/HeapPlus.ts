import { CompareFunc } from './utils.ts'

type TToMtFunc<T, MT> = (t: T) => MT

/**
 * 加强堆 (大根堆)
 */
export class HeapPlus<T, MT> {
  protected _indexMap = new Map<MT, number>()
  protected _elements: T[] = []

  constructor(
    protected _tToMt: TToMtFunc<T, MT>,
    protected _comparator: CompareFunc<T>,
    elements: T[] = []
  ) {
    this._elements = elements
  }

  public get length(): number {
    return this._elements.length
  }

  public isEmpty(): boolean {
    return this.length <= 0
  }
  public get(index = 0): T {
    this.checkIndex(index)
    return this._elements[index]
  }

  public add(elem: T): void {
    this._elements.push(elem)
    this.shiftUp(this.length - 1)
  }

  public indexOf(mKey: MT): number | undefined {
    return this._indexMap.get(mKey)
  }

  /**
   * 删除堆顶元素
   */
  public remove(index = 0): T {
    this.checkIndex(index)

    const del = this._elements[index]
    this._indexMap.delete(this._tToMt(del))

    if (index === this.length - 1) {
      this._elements.pop()
    } else {
      this._elements[index] = this._elements.pop()!
      this.shiftDown(index)
      this.shiftUp(index)
    }
    return del
  }

  /**
   * 替换堆顶元素
   */
  public replace(elem: T, index = 0): T {
    this.checkIndex(index)

    const del = this._elements[index]

    this._elements[index] = elem
    this.shiftUp(index)
    this.shiftDown(index)
    return del
  }

  /**
   * 获取元素索引
   */
  public getIndex(elem: T): number | undefined {
    return this._indexMap.get(this._tToMt(elem))
  }

  /**
   * @override [在下滤的过程中更新索引]
   */
  protected shiftDown(index: number): void {
    const parent = this._elements[index]

    const half = this.length >> 1
    while (index < half) {
      let childIndex = (index << 1) + 1
      if (
        childIndex + 1 < this.length &&
        this._comparator(
          this._elements[childIndex],
          this._elements[childIndex + 1]
        ) <= 0
      ) {
        ++childIndex
      }

      const child = this._elements[childIndex]
      if (this._comparator(child, parent) <= 0) break

      this._indexMap.set(this._tToMt(child), index)
      this._elements[index] = child
      index = childIndex
    }

    this._indexMap.set(this._tToMt(parent), index)
    this._elements[index] = parent
  }

  /**
   * @override [在上滤的过程中更新索引]
   */
  protected shiftUp(index: number): void {
    const child = this._elements[index]
    while (index > 0) {
      const parentIndex = (index - 1) >> 1
      const parent = this._elements[parentIndex]

      if (this._comparator(child, parent) <= 0) break

      this._indexMap.set(this._tToMt(parent), index)
      this._elements[index] = parent

      index = parentIndex
    }

    this._indexMap.set(this._tToMt(child), index)
    this._elements[index] = child
  }

  /**
   * 检查下标是否越界
   */
  protected checkIndex(index: number): void {
    if (index < 0 || index >= this.length) {
      throw new Error('index out of bounds')
    }
  }
}

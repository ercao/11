import { CompareFunc, compare } from "./utils";

/**
 * 大顶堆
 */
export class Heap<T> {
  constructor(_comparator: CompareFunc<T>);
  constructor(_comparator: CompareFunc<T>, elements: T[]);

  constructor(
    //
    protected _comparator: CompareFunc<T>, // 比较器
    protected _elements: T[] = [] // 数组
  ) {
    this.heapify();
  }

  /** 获取堆元素数量 */
  public get length(): number {
    return this._elements.length;
  }

  /** 堆是否为空 */
  public isEmpty(): boolean {
    return this.length <= 0;
  }

  /** 获取堆顶元素 */
  public get(): T {
    this.checkIndex(0);
    return this._elements[0];
  }

  /**
   * 在堆顶添加元素
   *
   * 在数组结尾加入这个元素，然后将添加的哪个元素上滤
   */
  public add(elem: T): void {
    this._elements.push(elem);
    this.shiftUp(this.length - 1);
  }

  /**
   * 删除堆顶元素
   *
   * 用数组最后一个元素替换 堆顶元素，然后再将堆顶元素下滤
   */
  public remove(): T {
    this.checkIndex(0);

    const del = this._elements[0];
    if (this.length === 1) {
      this._elements.pop();
    } else {
      this._elements[0] = this._elements.pop()!;
      this.shiftDown(0);
    }
    return del;
  }

  /**
   * 替换堆顶元素
   *
   * 替换堆顶元素，然后下滤
   */
  public replace(elem: T): T {
    this.checkIndex(0);

    const del = this._elements[0];
    this._elements[0] = elem;
    this.shiftDown(0);
    return del;
  }

  /**
   * 下滤操作
   */
  protected shiftDown(index: number): void {
    const parent = this._elements[index];
    const half = this._elements.length >> 1;
    while (index < half) {
      let childIndex = (index << 1) + 1;
      if (
        compare(childIndex + 1, this.length) < 0 &&
        this._comparator(this._elements[childIndex], this._elements[childIndex + 1]) <= 0
      ) {
        childIndex++;
      }
      const child = this._elements[childIndex];

      if (this._comparator(child, parent) <= 0) break;

      this._elements[index] = child;
      index = childIndex;
    }

    this._elements[index] = parent;
  }

  /**
   * 上滤操作
   */
  protected shiftUp(index: number): void {
    const child = this._elements[index];

    while (index > 0) {
      const parentIndex = (index - 1) >> 1;
      const parent = this._elements[parentIndex];

      if (this._comparator(child, parent) <= 0) break;

      this._elements[index] = parent;
      index = parentIndex;
    }

    this._elements[index] = child;
  }

  /** 将堆中所有元素，变成大根堆 */
  protected heapify(): void {
    // i = this.length: 保证每一个元素初始化的是否都进行下滤操作
    for (let i = this.length - 1; i >= 0; --i) {
      this.shiftDown(i);
    }
    return;
  }

  /**
   * 检查下标是否越界
   */
  protected checkIndex(index: number): void {
    if (index < 0 || index >= this.length) {
      throw new Error("index out of bounds");
    }
  }
}

//
// 并查集 - [基于 Rank 的优化, 路径分裂]
// 时间复杂度 O(α) 可以认为是 O(1)
//

export class Node<T> {
  public rank = 1;
  public parent: Node<T>;

  constructor(public value: T) {
    this.parent = this;
  }
}

export class UnionFind<T> {
  private _nodes = new Map<T, Node<T>>();

  public constructor(values: T[]) {
    values.forEach((value) => this._nodes.set(value, this.createNode(value)));
  }

  /** 获取不相交的集合数 */
  public unconnectedSize(): number {
    return Array.from(this._nodes.values()).filter((node) => node.parent === node).length;
  }

  public same(value1: T, value2: T): boolean {
    const root1 = this.find(value1);
    const root2 = this.find(value2);
    return !!(root1 && root2 && root1 === root2);
  }

  /**
   * @override
   */
  private createNode(value: T): Node<T> {
    return new Node<T>(value);
  }

  /**
   * @override
   */
  public find(value: T): T | undefined {
    return this.findNode(value)?.value;
  }

  /**
   * 并操作，基于 rank 的优化
   * rank 大的顶点 rank 的顶点的父亲
   * @override
   */
  public union(value1: T, value2: T): void {
    const root1 = this.findNode(value1);
    const root2 = this.findNode(value2);

    if (!root2 || !root1 || root2 === root1) return;

    const cmp = root1.rank - root2.rank;
    if (cmp > 0) {
      root2.parent = root1;
    } else {
      root1.parent = root2;
      if (cmp === 0) ++root2.rank;
    }
  }

  /**
   * 寻找根节点 - [路径分裂]
   * 每次查询 高度会减小一半
   */
  protected findNode(value: T): Node<T> | undefined {
    let node = this._nodes.get(value);
    if (!node) return;

    while (node.parent !== node) {
      const parent: Node<T> = node.parent;
      node.parent = node.parent.parent;
      node = parent;
    }

    return node;
  }
}

///!
///! 邻接图 (类似于二维矩阵，只不过是使用 哈希表代替数组)
///! 边是有向边 （无向边可以通过两条相反的有向边来实现）
///! 每条边都有权值
///!

/** 顶点信息 - 暴露给外界的 */
export class VertexInfo<V, E> {
  constructor(
    //
    public value: V,
    public inEdges: Array<EdgeInfo<V, E>> = [],
    public outEdges: Array<EdgeInfo<V, E>> = []
  ) {}
}

/** 边信息 - 暴露给外界的*/
export class EdgeInfo<V, E> {
  constructor(
    //
    public from: V,
    public to: V,
    public weight: E
  ) {}
}

/** 顶点 （图结构内部使用）*/
export class Vertex<V, E> {
  /**入度的边 */
  public inEdges = new Map<V, Edge<V, E>>();

  /**出度的边*/
  public outEdges = new Map<V, Edge<V, E>>();

  constructor(public value: V) {}

  info(): VertexInfo<V, E> {
    return new VertexInfo(
      this.value,
      Array.from(this.inEdges.values()).map((edge) => edge.info()),
      Array.from(this.outEdges.values()).map((edge) => edge.info())
    );
  }
}

/** 边 （图结构内部使用）*/
export class Edge<V, E> {
  constructor(
    //
    public from: Vertex<V, E>,
    public to: Vertex<V, E>,
    public weight: E
  ) {}

  info(): EdgeInfo<V, E> {
    return new EdgeInfo<V, E>(this.from.value, this.to.value, this.weight);
  }
}

/**
 * 图结构
 */
export class Graph<V, E> {
  public _vertices = new Map<V, Vertex<V, E>>(); // 图中所有的顶点
  public _edges = new Set<Edge<V, E>>(); // 图中所有的边

  /** 获取顶点数量 */
  public verticesSize(): number {
    return this._vertices.size;
  }

  /** 获取边数量 */
  public edgeSize(): number {
    return this._edges.size;
  }

  /// 获取一个顶点
  /// 如果 v 为 undefined 则返回第一个顶点
  public getVertex(v?: V): Vertex<V, E> {
    return v ? this._vertices.get(v) : this._vertices.values().next().value;
  }

  /** 添加顶点 */
  public addVertex(value: V): void {
    this.addVertexNode(value);
  }

  /** 添加有向边 */
  public addEdge(from: V, to: V, weight: E): void {
    const fromVertex = this.addVertexNode(from);
    const toVertex = this.addVertexNode(to);

    // 存在这个边
    if (fromVertex.outEdges.has(toVertex.value)) return;

    // 添加这个边
    const newEdge = new Edge(fromVertex, toVertex, weight);
    fromVertex.outEdges.set(to, newEdge);
    toVertex.inEdges.set(from, newEdge);
    this._edges.add(newEdge);
  }

  /**
   * 删除顶点
   * 删除顶点, 同时删除所有与该点相关的出边和入边
   */
  public removeVertex(value: V): void {
    const vertex = this._vertices.get(value);
    if (!vertex) return;

    vertex.inEdges.forEach(this._edges.delete.bind(this._edges)); // 删除入边
    vertex.outEdges.forEach(this._edges.delete.bind(this._edges)); // 删除出边
    this._vertices.delete(value); // 删除这个顶点
  }

  /**
   * 删除有向边
   */
  public removeEdge(from: V, to: V): void {
    // 对 from -> to 的有效性进行判断
    const fromVertex = this._vertices.get(from);
    const toVertex = this._vertices.get(to);
    if (!fromVertex || !toVertex) return;

    const edge = fromVertex.outEdges.get(to);
    if (!edge) return;

    fromVertex.outEdges.delete(to); // 删除终点的入边
    toVertex.inEdges.delete(from); // 删除始点的出边
    this._edges.delete(edge); // 删除这个边
  }

  /** 获取顶点, 如果不存在就添加 */
  protected addVertexNode(value: V): Vertex<V, E> {
    let vertex = this._vertices.get(value);
    if (!vertex) {
      vertex = new Vertex(value);
      this._vertices.set(value, vertex);
    }
    return vertex;
  }
}

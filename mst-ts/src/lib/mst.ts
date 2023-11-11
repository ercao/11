//
// 最小生成树算法
//

import { Heap } from "./Heap";
import { Edge, EdgeInfo, Graph } from "./Graph";
import { CompareFunc } from "./utils";
import { UnionFind } from "./UnionFind";

/**
 * Prim 算法  O(VlogE)
 * 
 * @param graph:
 * @param begin: 从这个点开始执行 prim 算法， 如果不指定，就随机一个点
 * @param compare: 权值比较器
 *
 * @returns: 最小生成树的 边
 **/
export function prim<V, E>(graph: Graph<V, E>, compare: CompareFunc<E>, begin?: V): EdgeInfo<V, E>[] {
  let vertex = graph.getVertex(begin); // 获取该顶点， 如果该顶点在图中不存在就随机返回图中的一个顶点
  if (!vertex) return [];

  const edgeSize = graph.verticesSize() - 1; // 最小生成树边的数量
  const edges: EdgeInfo<V, E>[] = []; // 最小生成树的边
  const visited = new Set<V>([vertex.value]); // 使用哈希表记录访问过的节点

  // 初始化一个小根堆，并将 vertex 的所有边放入堆中
  const heap = new Heap<Edge<V, E>>(
    (e1, e2) => compare(e2.weight!, e1.weight!), //
    [...vertex.outEdges.values()]
  );

  // 反复取出堆顶的边，即为最小边，
  // 然后判断该边的终点是否已经访问过，如果没访问过该边就是最小生成树的边，同时将该边的所有出边放入到小根堆中
  while (!heap.isEmpty() && edges.length < edgeSize) {
    const edge = heap.remove();
    vertex = edge.to;
    if (visited.has(vertex.value)) continue; // 判断该边终点是否访问过

    visited.add(vertex.value);
    vertex.outEdges.forEach(heap.add.bind(heap)); // 将该边终点的所有出边放入到小根堆中
    edges.push(edge.info()); // 放入到最小生成树中
  }
  return edges;
}

/**
 * Kruskal 算法  O(ElogE)
 *
 * @param graph:
 * @param compare: 权值比较器
 *
 * @returns: 最小生成树的 边
 **/
export function kruskal<V, E>(graph: Graph<V, E>, compare: CompareFunc<E>): EdgeInfo<V, E>[] {
  const edgeSize = graph.verticesSize() - 1; // 最小生成树边的数量

  const edges: EdgeInfo<V, E>[] = []; // 最小生成树的边

  // 初始化一个边查缉，并将图中的所有顶点放入并查集中
  const unionfind = new UnionFind([...graph["_vertices"].keys()]);

  // 初始化一个小根堆并将图中所有的边加入到小根堆中
  const heap = new Heap<Edge<V, E>>(
    (e1, e2) => compare(e2.weight!, e1.weight!), //
    [...graph["_edges"].values()]
  );

  // 重复取出堆顶的边，该边即为权值最小的边
  // 如果该边的始点和终点在并查集中不是连通的, 就将其连通，然后将其加入到最小生成树中
  while (!heap.isEmpty() && edges.length < edgeSize) {
    const edge = heap.remove();
    if (unionfind.same(edge.from.value, edge.to.value)) continue; // 判断是否在并查集中是连同的

    unionfind.union(edge.from.value, edge.to.value);
    edges.push(edge.info());
  }

  return edges;
}

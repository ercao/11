import { getDistance } from "geolib";
import { Graph, EdgeInfo } from "./Graph";
import { kruskal, prim } from "./mst";
import { compare } from "./utils";
import data from "../../data.json";

function graph2matrix<E>(graph: Graph<number, E>): E[][] {
  let matrix = new Array(graph.verticesSize());
  for (let i = 0; i < graph.verticesSize(); ++i) {
    matrix[i] = new Array(graph.verticesSize());
    matrix[i].fill(0);
  }

  graph._edges.forEach((edge) => {
    matrix[edge.from.value][edge.to.value] = edge.weight;
  });

  return matrix;
}

test("fdas", () => {
  let graph = new Graph<any, number>();

  graph.addEdge(1, 2, 9);
  graph.addEdge(1, 3, 7);
  graph.addEdge(1, 4, 3);
  graph.addEdge(1, 5, 2);

  graph.addEdge(2, 6, 4);
  graph.addEdge(2, 7, 2);
  graph.addEdge(2, 8, 1);

  graph.addEdge(3, 6, 2);
  graph.addEdge(3, 7, 7);

  graph.addEdge(4, 8, 11);

  graph.addEdge(5, 7, 11);
  graph.addEdge(5, 8, 8);

  graph.addEdge(6, 9, 6);
  graph.addEdge(6, 10, 5);

  graph.addEdge(7, 9, 4);
  graph.addEdge(7, 10, 3);

  graph.addEdge(8, 10, 5);
  graph.addEdge(8, 11, 6);

  graph.addEdge(9, 12, 4);
  graph.addEdge(10, 12, 2);
  graph.addEdge(11, 12, 5);

  console.log(graph2matrix(graph));
});

/*
       a  b  c  d  e  f
    a [0, 1, 0, 4, 3, 0]
    b [1, 0, 0, 4, 2, 0]
    c [0, 0, 0, 0, 4, 5]
    d [4, 4, 0, 0, 4, 0]
    e [3, 2, 4, 4, 0, 7]
    f [0, 0, 5, 0, 7, 0]
  */
test("mst2", () => {
  let graph = new Graph<any, number>();

  let g = [
    [0, 1, 0, 4, 3, 0],
    [1, 0, 0, 4, 2, 0],
    [0, 0, 0, 0, 4, 5],
    [4, 4, 0, 0, 4, 0],
    [3, 2, 4, 4, 0, 7],
    [0, 0, 5, 0, 7, 0],
  ];

  g.forEach((tos, from) => {
    tos.forEach((weight, to) => {
      if (weight > 0) {
        graph.addEdge(from, to, weight);
      }
    });
  });

  let path = prim(graph, compare);

  console.log(
    graph,
    path,
    path.reduce((prev, cur) => prev + cur.weight, 0)
  );

  console.log(graph2matrix(graph));
});

test("mst", () => {
  let graph = new Graph<any, number>();

  for (const a of data) {
    for (const b of data) {
      if (a === b) continue;
      const weight = getDistance(a.point, b.point);
      graph.addEdge(a.point, b.point, weight);
    }
  }

  console.log(graph);

  let path1 = prim(graph, compare);
  let path2 = kruskal(graph, compare);

  const fn = <V>(path: EdgeInfo<V, number>[]): number => path.reduce((prev, cur) => prev + cur.weight, 0);

  console.log(path1, path2, fn(path1), fn(path2));

  expect(fn(path1)).toBe(fn(path2));
});

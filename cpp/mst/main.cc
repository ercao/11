#include <iostream>
#include "./include/graph.h"

using namespace std;

int main() {
  Graph<string, int> graph;

  graph.addEdge("A", "B", 6);
  graph.addEdge("A", "C", 1);
  graph.addEdge("A", "D", 5);
  graph.addEdge("B", "C", 5);
  graph.addEdge("B", "E", 3);
  graph.addEdge("B", "A", 6);
  graph.addEdge("C", "A", 1);
  graph.addEdge("C", "B", 5);
  graph.addEdge("C", "E", 6);
  graph.addEdge("C", "F", 4);
  graph.addEdge("C", "D", 5);
  graph.addEdge("D", "A", 5);
  graph.addEdge("D", "C", 5);
  graph.addEdge("D", "F", 2);
  graph.addEdge("E", "B", 3);
  graph.addEdge("E", "C", 6);
  graph.addEdge("E", "F", 6);
  graph.addEdge("F", "E", 6);
  graph.addEdge("F", "C", 4);
  graph.addEdge("F", "D", 2);

  std::cout << graph << endl;

  /////// 最小生成树
  auto edge_info = *graph.mst();
  for (auto &edge: edge_info) {
    cout << "(" << edge->from << "->" << edge->to << ", " << edge->weight << ")";
  }
  return 0;
}

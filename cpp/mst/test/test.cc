//
// Created by ercao on 11/4/21.
//

//
// Created by ercao on 11/4/21.
//
#include "test.h"

ostream &operator<<(ostream &os, const People &people) {
  os << "People: { name: " << people.name << ", age: " << people.age << " }";
  return os;
}

void testDsu() {
  People people1 = {"A", 1};
  People people2 = {"B", 1};
  People people3 = {"C", 1};
  People people4 = {"D", 2};
  People people5 = {"F", 2};
  People people6 = {"G", 2};
  People people7 = {"D", 2};

  UnionFind<People, People::Hash, People::Equal>
      people_union_find({
                            people1, people2, people3, people4, people5,
                            people6, people7
                        });

  cout << people_union_find.size() << endl;
  cout << people_union_find.isConnected(people1, people1) << endl;

  people_union_find.unionElement(people1, people2);
  people_union_find.unionElement(people3, people2);
  people_union_find.unionElement(people4, people2);

  cout << people_union_find.find(people1) << people_union_find.find(people2)
       << people_union_find.isConnected(people1, people2) << endl;
  cout << people_union_find.find(people4) << people_union_find.find(people3)
       << people_union_find.isConnected(people4, people3) << endl;
  cout << people_union_find.find(people3) << people_union_find.find(people6)
       << people_union_find.isConnected(people3, people6) << endl;
}

void testHeap() {

  Heap<People> heap;
  People people1 = {"A", 1};
  People people2 = {"B", 2};
  People people3 = {"C", 3};
  People people4 = {"D", 4};
  People people5 = {"F", 5};
  People people6 = {"G", 6};
  People people7 = {"D", 7};
  People people8 = {"A", 7};

  heap.add(people1).add(people2).add(people3).add(people4)
      .add(people5).add(people6).add(people7).add(people8);
  while (!heap.empty()) {
    cout << heap.get() << endl;
    heap.remove();
  }
}

void testGraph() {
  Graph<People, int, People::Hash, People::Equal> graph;

  People peopleA = {"A", 1};
  People peopleB = {"B", 2};
  People peopleC = {"C", 3};
  People peopleD = {"D", 4};
  People peopleE = {"E", 5};
  People peopleF = {"F", 6};

  graph.addVertex(peopleA);
  graph.addVertex(peopleB);
  graph.addVertex(peopleC);
  graph.addVertex(peopleD);
  graph.addVertex(peopleE);
  graph.addVertex(peopleF);
  //

  graph.addEdge(peopleA, peopleB, 6);
  graph.addEdge(peopleA, peopleC, 1);
  graph.addEdge(peopleA, peopleD, 5);
  graph.addEdge(peopleB, peopleC, 5);
  graph.addEdge(peopleB, peopleE, 3);
  graph.addEdge(peopleB, peopleA, 6);
  graph.addEdge(peopleC, peopleA, 1);
  graph.addEdge(peopleC, peopleB, 5);
  graph.addEdge(peopleC, peopleE, 6);
  graph.addEdge(peopleC, peopleF, 4);
  graph.addEdge(peopleC, peopleD, 5);
  graph.addEdge(peopleD, peopleA, 5);
  graph.addEdge(peopleD, peopleC, 5);
  graph.addEdge(peopleD, peopleF, 2);
  graph.addEdge(peopleE, peopleB, 3);
  graph.addEdge(peopleE, peopleC, 6);
  graph.addEdge(peopleE, peopleF, 6);
  graph.addEdge(peopleF, peopleE, 6);
  graph.addEdge(peopleF, peopleC, 4);
  graph.addEdge(peopleF, peopleD, 2);

  cout << graph << endl;

  auto edge_info = *graph.mst();
  cout << "size: " << edge_info.size() << ", [";
  for (auto &edge: edge_info) {
    cout << "(" << edge->from << "->" << edge->to << ", " << edge->weight << "), ";
  }
  cout << "]" << endl;
}

# 最小生成树 - Minimum Spanning Tree

## 1 Files

| dir     | file    | description            |
| ------- | ------- | ---------------------- |
| include | dsu.h   | 并查集数据结构         |
|         | graph.h | 图数据结构             |
|         | heap.h  | 小顶堆数据结构         |
| test    | test.cc | 测试并查集、图、小顶堆 |
|         | test.h  | ..                     |
| /       | main.cc | 入口文件               |

## 2. How to use

1. 内置数据类型

```c++
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

```

2. 自定义数据类型

    - 实现比较方法： 重载 `<` `>` `==` 运算符
    - 实现 `hashcode`、`equal` 方法（unordered_map要求）
    - 实现输出方法： 重载 `<<` 操作符

```c++
/**************************自定义数据类型 - begin**************************/
struct People {
 public:
  bool operator<(const People &people) const {
    int name_cmp = name.compare(people.name);
    return name_cmp < 0 || (name_cmp == 0 && age < people.age);
  }

  bool operator>(const People &people) const {
    int name_cmp = name.compare(people.name);
    return name_cmp > 0 || (name_cmp == 0 && age > people.age);
  }

  bool operator==(const People &people) const {
    return name == people.name && age == people.age;
  }

 public:
  struct Equal {
    bool operator()(const People &people1, const People &people2) const {
      return people1.name == people2.name && people1.age == people2.age;
    }
  };
  struct Hash {
    size_t operator()(const People &people) const {
      return hash<string>()(people.name) ^ hash<unsigned>()(people.age);
    }
  };
 public:
  string name;
  unsigned age;
};

ostream &operator<<(ostream &os, const People &people);
/**************************自定义数据类型 - end**************************/

// 测试
Graph<People, int, People::Hash, People::Equal> graph;

People peopleA = { "A", 1 };
People peopleB = { "B", 2 };
People peopleC = { "C", 3 };
People peopleD = { "D", 4 };
People peopleE = { "E", 5 };
People peopleF = { "F", 6 };

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
```

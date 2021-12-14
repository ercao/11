//
// Created by ercao on 11/4/21.
//
#ifndef MST__GRAPH_H_
#define MST__GRAPH_H_
#include "dsu.h"
#include "heap.h"
#include <any>
#include <functional>
#include <iostream>
#include <unordered_set>

/**
 * 图结构 (全部使用 智能指针减少内存管理代码)
 * @tparam V 顶点类型，可以为任意类型(自定义类型需要手动传入 Hash 和 Pred，
 * unordered_map要求)
 * @tparam E 权值类型，可以为任意类型
 * @tparam Hash 计算 V 的 hash code
 * @tparam Pred 判断 v1, v2 是否相等
 */
template <typename V, typename E, typename Hash = hash<V>,
          typename Pred = equal_to<V>>
class Graph {
public:
  typedef function<int(const E &, const E &)> WeightManager;
  struct EdgeInfo;
  enum MST_TYPE { PRIM, KRUSKAL, RANDOM };

private:
  struct Vertex;
  struct Edge;

  /**
   * 图打印函数
   */
  template <typename V_, typename E_, typename Hash_, typename Pred_>
  friend ostream &operator<<(ostream &os,
                             const Graph<V_, E_, Hash_, Pred_> &graph);

public:
  explicit Graph(const WeightManager &weight_manager = nullptr);

public:
  [[nodiscard]] size_t sizeVertices() const noexcept {
    return vertices_->size();
  }
  [[nodiscard]] size_t sizeEdges() const noexcept { return edges_->size(); }

  /**
   * 添加顶点
   */
  Graph &addVertex(const V &value) noexcept;

  /**
   * 添加有权边 如果不存在端点会进行创建并添加
   * @param from 始点
   * @param to 终点
   * @param weight 权值
   */
  Graph &addEdge(const V &from, const V &to, const E &weight) noexcept;

  /**
   * 删除顶点及其关联的所有边
   * @param value 顶点
   */
  Graph &removeVertex(const V &value);

  /**
   * 删除边 不删除顶点
   * @param from 始点
   * @param to 终点
   */
  Graph &removeEdge(const V &from, const V &to);

  /**
   * 是否包含某个顶点
   */
  bool contain(const V &value) const { return vertices_->contains(value); }

  /**
   * 清除所有顶点及其关联的边
   */
  Graph &clear() noexcept;

  /**
   * 根据当前时间戳随机调用 两种 最小生成树算法
   * @return
   */
  shared_ptr<vector<shared_ptr<EdgeInfo>>>
  mst(const MST_TYPE &type = MST_TYPE::RANDOM) const noexcept;

private:
  /**
   * 最小生成树算法 依赖于 hashMap 和 Heap T = O(v + e)
   * @return 最小生成树的 edges
   */
  shared_ptr<vector<shared_ptr<Edge>>> prim() const noexcept;

  /**
   * 最小生成树算法 依赖于 UnionFindSet 和 Heap T = O(v + e)
   * @return 最小生成树的 edges
   */
  shared_ptr<vector<shared_ptr<Edge>>> kruskal() const noexcept;

public:
  /**
   * 边信息，包含顶点、终点、权值
   * 暴露于外界
   */
  struct EdgeInfo {
    const V from;
    const V to;
    const E weight;

    EdgeInfo(const V &f, const V &t, const E &w) : from(f), to(t), weight(w) {}
    ~EdgeInfo() = default;
  };

private:
  /**
   * 内部顶点类： 保存顶点及使用HashMap存储出边和入边
   */
  struct Vertex {
    const V &value;
    shared_ptr<unordered_set<shared_ptr<Edge>>> out_edges =
        make_shared<unordered_set<shared_ptr<Edge>>>();
    shared_ptr<unordered_set<shared_ptr<Edge>>> in_edges =
        make_shared<unordered_set<shared_ptr<Edge>>>();
    explicit Vertex(const V &value) : value(value) {}
    ~Vertex() = default;
  };

  /**
   * 内部边类： 保存权值及始点和终点
   */
  struct Edge {
    any weight;
    shared_ptr<Vertex> from;
    shared_ptr<Vertex> to;
    Edge(shared_ptr<Vertex> f, shared_ptr<Vertex> t)
        : from(f), to(t), weight() {}
    Edge(shared_ptr<Vertex> f, shared_ptr<Vertex> t, const E &w)
        : from(f), to(t), weight(w) {}
    ~Edge() = default;

    static int compare(const shared_ptr<Edge> e1, const shared_ptr<Edge> &e2) {
      return any_cast<E>(e1->weight) - any_cast<E>(e2->weight);
    }

    /**
     * 转换为 EdgeInfo 暴露给外界
     * @return
     */
    shared_ptr<EdgeInfo> info() {
      return make_shared<EdgeInfo>(from->value, to->value, any_cast<E>(weight));
    }

    /**
     * 计算 hashcode： hashMap 要求
     */
    struct HashFunc {
      size_t operator()(const shared_ptr<Edge> &edge) const {
        return Hash()(edge->from->value) ^ Hash()(edge->to->value);
      }
    };

    /**
     * 判断两边是否相同： hashMap 要求
     */
    struct Equal {
      bool operator()(const shared_ptr<Edge> &edge1,
                      const shared_ptr<Edge> &edge2) const {
        return Pred()(edge1->from->value, edge2->from->value) &&
               Pred()(edge1->to->value, edge2->to->value);
      }
    };
  };

private:
  /**
   * 使用 HashMap 存储所有的内部顶点类实例
   */
  shared_ptr<unordered_map<V, shared_ptr<Vertex>, Hash, Pred>> vertices_ =
      make_shared<unordered_map<V, shared_ptr<Vertex>, Hash, Pred>>();

  /**
   * 使用 hashMap 存储所有的内部边类实例
   */
  shared_ptr<unordered_set<shared_ptr<Edge>, typename Edge::HashFunc,
                           typename Edge::Equal>>
      edges_ =
          make_shared<unordered_set<shared_ptr<Edge>, typename Edge::HashFunc,
                                    typename Edge::Equal>>();

  /**
   * 权值管理器： 目前还未用到
   */
  const WeightManager &weight_manager_;
};

template <typename V, typename E, typename Hash, typename Pred>
Graph<V, E, Hash, Pred>::Graph(const WeightManager &weight_manager)
    : weight_manager_(weight_manager) {}

template <typename V, typename E, typename Hash, typename Pred>
Graph<V, E, Hash, Pred> &
Graph<V, E, Hash, Pred>::addVertex(const V &value) noexcept {
  if (!vertices_->contains(value)) {
    vertices_->insert({value, make_shared<Vertex>(value)});
  }
  return *this;
}

template <typename V, typename E, typename Hash, typename Pred>
Graph<V, E, Hash, Pred> &
Graph<V, E, Hash, Pred>::addEdge(const V &from, const V &to,
                                 const E &weight) noexcept {
  addVertex(from);
  addVertex(to);
  auto from_vertex = vertices_->at(from);
  auto to_vertex = vertices_->at(to);
  auto edge = make_shared<Edge>(from_vertex, to_vertex, weight);

  if (!edges_->contains(edge)) {
    from_vertex->out_edges->insert(edge);
    to_vertex->in_edges->insert(edge);
    edges_->insert(edge);
  }
  return *this;
}

template <typename V, typename E, typename Hash, typename Pred>
Graph<V, E, Hash, Pred> &Graph<V, E, Hash, Pred>::removeVertex(const V &value) {
  try {
    shared_ptr<Vertex> vertex = vertices_->at(value);
    for (auto edge : *vertex->out_edges) {
      edge->to->in_edges->erase(edge);
      edges_->erase(edge);
    }

    for (auto edge : *vertex->in_edges) {
      edge->from->out_edges->erase(edge);
      edges_->erase(edge);
    }
    vertices_->erase(value);
  } catch (...) {
    throw out_of_range("haven't this vertex");
  }
  return *this;
}

template <typename V, typename E, typename Hash, typename Pred>
Graph<V, E, Hash, Pred> &Graph<V, E, Hash, Pred>::removeEdge(const V &from,
                                                             const V &to) {
  try {
    shared_ptr<Vertex> from_vertex = vertices_->at(from);
    shared_ptr<Vertex> to_vertex = vertices_->at(to);
    shared_ptr<Edge> edge =
        *edges_->find(make_shared<Edge>(from_vertex, to_vertex));

    edge->from->out_edges->erase(edge);
    edge->to->in_edges->erase(edge);
    edges_->erase(edge);
  } catch (...) {
    throw out_of_range("haven't this edge");
  }
  return *this;
}

template <typename V, typename E, typename Hash, typename Pred>
Graph<V, E, Hash, Pred> &Graph<V, E, Hash, Pred>::clear() noexcept {
  edges_->clear();
  vertices_->clear();
  return *this;
}

template <typename V, typename E, typename Hash, typename Pred>
shared_ptr<vector<shared_ptr<typename Graph<V, E, Hash, Pred>::EdgeInfo>>>
Graph<V, E, Hash, Pred>::mst(const MST_TYPE &type) const noexcept {
  auto edge_info = make_shared<vector<shared_ptr<EdgeInfo>>>();
  shared_ptr<vector<shared_ptr<Edge>>> edges;
  if (!vertices_->empty()) {
    switch (type) {
    case MST_TYPE::PRIM:
      edges = prim();
      break;
    case MST_TYPE::KRUSKAL:
      edges = kruskal();
      break;
    default:
      edges = (time(nullptr) % 2) ? kruskal() : prim();
      break;
    }
    for (auto edge : *edges)
      edge_info->push_back(edge->info());
  }
  return edge_info;
}

template <typename V, typename E, typename Hash, typename Pred>
shared_ptr<vector<shared_ptr<typename Graph<V, E, Hash, Pred>::Edge>>>
Graph<V, E, Hash, Pred>::prim() const noexcept {
  cout << "use Prim" << endl;
  auto edges = make_shared<vector<shared_ptr<Edge>>>();

  unordered_set<shared_ptr<Vertex>> visited;
  shared_ptr<Vertex> vertex = vertices_->begin()->second;
  visited.insert(vertex);
  Heap<shared_ptr<Edge>> minHeap(&Edge::compare);
  for (auto edge : *vertex->out_edges)
    minHeap.add(edge);

  while (!minHeap.empty()) {
    auto edge = minHeap.remove();
    if (visited.contains(edge->to))
      continue;

    edges->push_back(edge);
    visited.insert(edge->to);
    for (auto e : *edge->to->out_edges)
      minHeap.add(e);
  }
  return edges;
}

template <typename V, typename E, typename Hash, typename Pred>
shared_ptr<vector<shared_ptr<typename Graph<V, E, Hash, Pred>::Edge>>>
Graph<V, E, Hash, Pred>::kruskal() const noexcept {
  cout << "use Kruskal" << endl;
  auto edges = make_shared<vector<shared_ptr<Edge>>>();

  Heap<shared_ptr<Edge>> minHeap(&Edge::compare);
  for (auto edge : *edges_)
    minHeap.add(edge);
  vector<V> list;
  for (auto &entry : *vertices_)
    list.push_back(entry.first);
  UnionFind<V, Hash, Pred> union_find(list);

  while (!minHeap.empty() && edges->size() < sizeVertices()) {
    auto edge = minHeap.remove();
    if (union_find.isConnected(edge->from->value, edge->to->value))
      continue;

    edges->push_back(edge);
    union_find.unionElement(edge->from->value, edge->to->value);
  }
  return edges;
}

////////////////////////////////////// other operator
template <typename V, typename E, typename Hash, typename Pred>
ostream &operator<<(ostream &os, const Graph<V, E, Hash, Pred> &graph) {
  os << "Graph Info:" << endl
     << "[Edges, " << graph.sizeEdges() << "]: " << endl
     << "\t[ ";
  for (auto edge : *graph.edges_) {
    os << "(" << edge->from->value << "->" << edge->to->value << ", "
       << any_cast<E>(edge->weight) << ") ";
  }
  os << "]" << endl << "[Vertex, " << graph.sizeVertices() << "]: ";
  for (std::pair<V, shared_ptr<typename Graph<V, E, Hash, Pred>::Vertex>>
           entry : *graph.vertices_) {
    os << endl << "\t" << entry.first << ": " << endl << "\t\t out: [ ";
    for (shared_ptr<typename Graph<V, E, Hash, Pred>::Edge> edge :
         *entry.second->out_edges) {
      os << "(" << edge->from->value << "->" << edge->to->value << ", "
         << any_cast<E>(edge->weight) << ") ";
    }
    os << "]" << endl << "\t\t in : [ ";
    for (shared_ptr<typename Graph<V, E, Hash, Pred>::Edge> edge :
         *entry.second->in_edges) {
      os << "(" << edge->from->value << "->" << edge->to->value << ", "
         << any_cast<E>(edge->weight) << ") ";
    }
    os << "]";
  }
  return os;
}
#endif // MST__GRAPH_H_
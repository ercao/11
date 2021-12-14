#include <iostream>

template <typename V, typename E, typename Hash = hash<V>,
          typename Pred = equal_to<V>>
class Graph {
private:
  // 使用 HashMap 存储所有的内部顶点类实例
  shared_ptr<unordered_map<V, shared_ptr<Vertex>, Hash, Pred>> vertices_ =
      make_shared<unordered_map<V, shared_ptr<Vertex>, Hash, Pred>>();

  // 使用 hashMap 存储所有的内部边类实例
  shared_ptr<unordered_set<shared_ptr<Edge>, typename Edge::HashFunc,
                           typename Edge::Equal>>
      edges_ =
          make_shared<unordered_set<shared_ptr<Edge>, typename Edge::HashFunc,
                                    typename Edge::Equal>>();
  // 权值管理器
  const WeightManager &weight_manager_;
}

// 边信息 - 暴露给外界
struct EdgeInfo {
  const V from;
  const V to;
  const E weight;
};

// 顶点信息 - 图结构内部使用
struct Vertex {
  const V &value;
  shared_ptr<unordered_set<shared_ptr<Edge>>> out_edges =
      make_shared<unordered_set<shared_ptr<Edge>>>();
  shared_ptr<unordered_set<shared_ptr<Edge>>> in_edges =
      make_shared<unordered_set<shared_ptr<Edge>>>();
  explicit Vertex(const V &value) : value(value) {}
  ~Vertex() = default;
};

// 边信息 - 图内部使用
struct Edge {
  any weight;
  shared_ptr<Vertex> from;
  shared_ptr<Vertex> to;

  // 转换为 EdgeInfo 暴露给外界
  shared_ptr<EdgeInfo> info() {
    return make_shared<EdgeInfo>(from->value, to->value, any_cast<E>(weight));
  }
};

/*** Heap **/

// 堆结构
template <typename E> class Heap {
public:
  // 比较器类型
  typedef function<int(const E &, const E &)> Comparator;

private:
  // 使用动态数组存储所有元素
  shared_ptr<vector<E>> elements_ = make_shared<vector<E>>();
  // 存储自定义数据类型使用的比较器
  const Comparator &comparator_;
};

// 并查集 (使用 路径压缩和 基于 Rank 的优化) （内部使用链表 + HashMap实现）
template <typename V, typename Hash = hash<V>, typename Pred = equal_to<V>>
class UnionFind {
public:
  // 判断是否为同一集合
  bool isConnected(const V &v1, const V &v2) const;

  // 和并两个元素
  UnionFind &unionElement(const V &v1, const V &v2);

private:
  // 内部节点
  struct Node {
    explicit Node(const V &v) : value(v) {}
    const V &value;
    size_t rank = 1;
    shared_ptr<Node> parent = nullptr;
  };

private:
  // HashMap 存储所有的内部节点和节点名称
  shared_ptr<unordered_map<V, shared_ptr<Node>, Hash, Pred>> elements_ =
      make_shared<unordered_map<V, shared_ptr<Node>, Hash, Pred>>();
};

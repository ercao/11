//
// Created by ercao on 11/4/21.
//
#ifndef MST_INCLUDE_DSU_H_
#define MST_INCLUDE_DSU_H_
#include <unordered_map>
#include <memory>
#include <vector>
using namespace std;

/**
 * 并查集 (使用 路径压缩和 基于 Rank 的优化) （内部使用链表 + HashMap实现）
 * @tparam V 顶点类型，可以为任意类型(自定义类型需要手动传入 Hash 和 Pred， unordered_map要求)
 * @tparam Hash 计算 V 的 hash code
 * @tparam Pred 判断 v1, v2 是否相等
 */
template<typename V, typename Hash = hash<V>, typename Pred = equal_to<V>>
class UnionFind {
 private:
  struct Node;
 public:
  explicit UnionFind(const vector<V> &values);
  ~UnionFind();

 public:
  [[nodiscard]] size_t size() const noexcept { return elements_->size(); };
  [[nodiscard]] bool empty() const noexcept { return elements_->empty(); }

  /**
   * 寻找给定值的组编号（根值）
   */
  const V &find(const V &value) const;

  /**
   * 判断是否为同一集合
   */
  bool isConnected(const V &v1, const V &v2) const;

  /**
   * 和并两个元素
   */
  UnionFind &unionElement(const V &v1, const V &v2);

  /**
   * 清空所有元素
   */
  UnionFind &clear() noexcept;

 private:
  /**
   * 返回给定名称节点的内部根节点指针
   * @param value 节点名称
   * @return 内部根节点指针
   */
  shared_ptr<Node> findNode(const V &value) const;
  /**
   * 返回给定名称的内部节点指针
   * @param value 节点名称
   * @return 内部节点指针
   */
  shared_ptr<Node> node(const V &value) const;

 private:
  /**
   * 内部节点
   */
  struct Node {
    explicit Node(const V &v) : value(v) {}
    const V &value;
    size_t rank = 1;
    shared_ptr<Node> parent = nullptr;
  };

 private:
  /**
   * HashMap 存储所有的内部节点和节点名称
   */
  shared_ptr<unordered_map<V, shared_ptr<Node>, Hash, Pred>>
      elements_ = make_shared<unordered_map<V, shared_ptr<Node>, Hash, Pred>>();
};

template<typename V, typename Hash, typename Pred>
UnionFind<V, Hash, Pred>::UnionFind(const vector<V> &values) {
  shared_ptr<Node> node = nullptr;
  for (auto &value: values) {
    node = make_shared<Node>(value);
    elements_->insert({value, node});
    node->parent = node;
  }
}

template<typename V, typename Hash, typename Pred>
UnionFind<V, Hash, Pred>::~UnionFind() = default;

template<typename V, typename Hash, typename Pred>
bool UnionFind<V, Hash, Pred>::isConnected(const V &v1, const V &v2) const { return find(v1) == find(v2); }

template<typename V, typename Hash, typename Pred>
UnionFind<V, Hash, Pred> &UnionFind<V, Hash, Pred>::unionElement(const V &v1, const V &v2) {
  shared_ptr<Node> root1 = findNode(v1);
  shared_ptr<Node> root2 = findNode(v2);

  // by Rank
  if (root1->value != root2->value) {
    size_t cmp = root1->rank - root2->rank;
    if (cmp > 0) {
      root2->parent = root1;
    } else {
      root1->parent = root2;
      if (cmp == 0) {
        ++root2->rank;
      }
    }
  }
  return *this;
}

template<typename V, typename Hash, typename Pred>
const V &UnionFind<V, Hash, Pred>::find(const V &value) const { return findNode(value)->value; }

template<typename V, typename Hash, typename Pred>
shared_ptr<typename UnionFind<V, Hash, Pred>::Node> UnionFind<V, Hash, Pred>::findNode(const V &value) const {
  shared_ptr<Node> element = node(value);
  shared_ptr<Node> parent = nullptr;

  // use path compression
  // TODO: rank fix
  while (element != (parent = element->parent)) {
    element->parent = parent;
    element = element->parent;
  }
  return element;
}

template<typename V, typename Hash, typename Pred>
UnionFind<V, Hash, Pred> &UnionFind<V, Hash, Pred>::clear() noexcept {
  elements_->clear();
  return this;
}

template<typename V, typename Hash, typename Pred>
shared_ptr<typename UnionFind<V, Hash, Pred>::Node> UnionFind<V, Hash, Pred>::node(const V &value) const {
  try {
    return elements_->at(value);
  } catch (out_of_range &) {
    throw out_of_range("the set don't contain the key ");
  }
}
#endif //MST_INCLUDE_DSU_H_

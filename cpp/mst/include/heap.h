//
// Created by ercao on 11/4/21.
//
#ifndef MST_INCLUDE_HEAP_H_
#define MST_INCLUDE_HEAP_H_
#include <vector>
#include <functional>
#include <memory>

using namespace std;

/**
 * 堆结构 (内部使用动态数组实现)
 * @tparam E 元素类型，可以为任意类型(自定义类型需要传入 Comparator 比较器)
 */
template<typename E>
class Heap {
 public:
  /**
   * 比较器类型
   */
  typedef function<int(const E &, const E &)> Comparator;
 public:
  explicit Heap(const Comparator &comparator = nullptr) noexcept;
  explicit Heap(const vector<E> &elements, const Comparator &comparator = nullptr) noexcept;
  ~Heap() noexcept;

 public:
  [[nodiscard]] size_t size() const noexcept { return elements_->size(); }
  [[nodiscard]] bool empty() const noexcept { return elements_->empty(); }

  /**
   * 添加元素： 末尾添加，上滤
   * @param element 待添加的元素，只保存元素指针不进行内存管理
   */
  Heap &add(const E &element) noexcept;

  /**
   * 取得堆顶元素
   */
  E get() const;

  /**
   * 替换堆顶元素： 下滤
   */
  E replace(const E &element);

  /**
   * 删除堆顶元素
   */
  E remove();

  /**
   * 清空所有元素
   */
  Heap &clear() noexcept;
 private:

  /**
   * 比较 两元素：
   *    1. 自定义类型使用comparator_比较器
   *    2. 内置数据类型使用自己的比较逻辑
   * @return 1: a1 > a2; 0: a1 == a2; -1: a1 < a2;
   */
  int compare(const E &a1, const E &a2) const noexcept;

  /**
   * 检查是否越界： 越界抛出out_of_range异常
   */
  void checkRange() const;

  /**
   * 上滤操作
   * @param index
   */
  void shiftUp(size_t index) noexcept;

  /**
   * 下滤操作
   * @param index
   */
  void shiftDown(size_t index) noexcept;

  /**
   * 构建堆
   */
  void heapify() noexcept;
 private:
  /**
   * 使用动态数组存储所有元素
   */
  shared_ptr<vector<E>> elements_ = make_shared<vector<E>>();
  /**
   * 存储自定义数据类型使用的比较器
   */
  const Comparator &comparator_;
};

template<typename E>
Heap<E>::Heap(const Comparator &comparator) noexcept :comparator_(comparator) {}

template<typename E>
Heap<E>::Heap(const vector<E> &elements, const Comparator &comparator) noexcept
    : elements_(elements), comparator_(comparator) {
  heapify();
}
template<typename E>
Heap<E>::~Heap() noexcept = default;

template<typename E>
Heap<E> &Heap<E>::add(const E &element) noexcept {
  elements_->push_back(element);
  shiftUp(size() - 1);
  return *this;
}

template<typename E>
E Heap<E>::get() const {
  checkRange();
  return elements_->at(0);
}

template<typename E>
E Heap<E>::replace(const E &element) {
  checkRange();
  E old_element = elements_->at(0);
  elements_->at(0) = element;
  shiftDown(0);
  return old_element;
}

template<typename E>
E Heap<E>::remove() {
  checkRange();

  E old_element = elements_->at(0);
  elements_->at(0) = elements_->at(size() - 1);
  elements_->pop_back();
  shiftDown(0);
  return old_element;
}

template<typename E>
Heap<E> &Heap<E>::clear() noexcept {
  elements_->clear();
  return *this;
}

template<typename E>
int Heap<E>::compare(const E &a1, const E &a2) const noexcept {
  // 自定义类型
  if (comparator_ != nullptr) {
    return comparator_(a1, a2);
  }

  // 内置类型
  if (a1 > a2) {
    return 1;
  } else if (a1 < a2) {
    return -1;
  }
  return 0;
}

template<typename E>
void Heap<E>::shiftUp(size_t index) noexcept {
  const E child = elements_->at(index);

  while (index > 0) {
    size_t parent_index = (index - 1) >> 1;
    const E parent = elements_->at(parent_index);
    if (compare(parent, child) <= 0) break;

    elements_->at(index) = parent;
    index = parent_index;
  }
  elements_->at(index) = child;
}

template<typename E>
void Heap<E>::shiftDown(size_t index) noexcept {
  if (size() <= 1) return;
  const E parent = elements_->at(index);

  size_t half_index = (size() >> 1) - 1;
  while (index <= half_index) {
    size_t child_index = (index << 1) | 1;
    if (child_index + 1 < size() && compare(elements_->at(child_index + 1), elements_->at(child_index)) < 0)
      ++child_index;

    const E child = elements_->at(child_index);

    if (compare(parent, child) <= 0) break;

    elements_->at(index) = child;
    index = child_index;
  }

  elements_->at(index) = parent;
}

template<typename E>
void Heap<E>::heapify() noexcept {
  for (size_t index = (size() - 1) >> 1; index >= 0; --index) shiftDown(index);
}

template<typename E>
void Heap<E>::checkRange() const {
  if (elements_->empty()) throw out_of_range("the heap is empty!");
}

#endif //MST_INCLUDE_HEAP_H_

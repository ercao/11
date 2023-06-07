#include "./sort.h"

static void swap(elem_type elems[], size_t first, size_t last) {
  elem_type temp = elems[first];
  elems[first] = elems[last];
  elems[last] = temp;
}

static size_t partition(elem_type elems[], size_t begin, size_t end,
                        comparator cmp) {
  // random position
  swap(elems, begin, begin + (size_t)(rand() % (end - begin)));
  elem_type povit = elems[begin];

  --end;
  while (begin < end) {
    while (begin < end) {
      if (cmp(povit, elems[end]) < 0) {
        --end;
      } else {
        elems[begin++] = elems[end];
        break;
      }
    }

    while (begin < end) {
      if (cmp(elems[begin], povit) < 0) {
        ++begin;
      } else {
        elems[end--] = elems[begin];
        break;
      }
    }
  }
  elems[begin] = povit;
  return begin;
}

static void qsortRecursion(elem_type elems[], size_t begin, size_t end,
                           comparator cmp) {
  if (end - begin > 1) {
    size_t pivot_index = partition(elems, begin, end, cmp);
    qsortRecursion(elems, begin, pivot_index, cmp);
    qsortRecursion(elems, pivot_index + 1, end, cmp);
  }
}

void quicksort(elem_type elems[], size_t length, comparator cmp, callback fun) {
  size_t size = sizeof(elem_type) * length;
  elem_type *sorted_elems = (elem_type *)malloc(size);
  memcpy(sorted_elems, elems, size);

  qsortRecursion(sorted_elems, 0, length, cmp);

  for (int i = 0; i < length; ++i) {  // fun(elems[]);
    fun(sorted_elems[i]);
  }

  free(sorted_elems);
  sorted_elems = NULL;
}

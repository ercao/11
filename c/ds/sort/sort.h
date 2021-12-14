#ifndef __SORT_SORT_H__
#define __SORT_SORT_H__

#include "../def.h"
#include <stdlib.h>
#include <time.h>
#include <memory.h>

void quicksort(elem_type elems[], size_t length, comparator cmp, callback fun);

#endif

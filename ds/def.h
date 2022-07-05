#ifndef __DEF_H__
#define __DEF_H__

typedef void *elem_type;
typedef void (*callback)(elem_type);
typedef int (*comparator)(elem_type, elem_type);

struct people {
  int age;
};

#endif
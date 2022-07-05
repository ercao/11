#ifndef __TREE_H__
#define __TREE_H__
#include "../def.h"
#include <stdlib.h>

struct tree_node {
  elem_type elem;
  struct tree_node *parent;
  struct tree_node *left;
  struct tree_node *right;
};

void morris(struct tree_node *node, callback fun);
void morris_in(struct tree_node *node, callback fun);
void morris_post(struct tree_node *node, callback fun);
void morris_prev(struct tree_node *node, callback fun);
#endif

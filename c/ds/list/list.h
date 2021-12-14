#ifndef __LIST_LIST_H__
#define __LIST_LIST_H__
#include "../def.h"
#include <stdbool.h>
#include <stdlib.h>

typedef void *linked_list_type;
typedef void *linked_node_type;

/**
 * @brief linked list[without header node]
 */
struct linked_list {
  struct linked_node *head;
  size_t size;
};

/**
 * @brief linked list node
 */
struct linked_node {
  elem_type elem;
  struct linked_node *prev;
  struct linked_node *next;
};

/****************linkedList function*******************/
linked_list_type init_linked_list(linked_list_type *p_list);

size_t size_linked_list(linked_list_type list);
bool empty_linked_list(linked_list_type list);

/**
 * @brief add elem to linked list tail
 */
linked_list_type add_linked_list(linked_list_type list, elem_type elem);

/**
 * @brief add elem to index back
 */
linked_list_type add_by_index_linked_list(linked_list_type list, size_t index,
                                          elem_type elem);
linked_list_type foreach_linked_list(linked_list_type list, callback fun);
linked_list_type get_linked_list(linked_list_type list, size_t index,
                                 callback fun);
linked_list_type remove_linked_list(linked_list_type list, size_t index,
                                    callback fun);
linked_list_type clear_linked_list(linked_list_type list);
linked_list_type destory_linked_list(linked_list_type *p_list);
#endif
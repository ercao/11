#include "list.h"

static struct linked_node *get_node(linked_list_type list, size_t index);
static void add_node(linked_list_type list, struct linked_node *node,
                     elem_type elem);

linked_list_type init_linked_list(linked_list_type *p_list) {
  if (NULL == p_list || NULL != *p_list)
    return p_list;

  *p_list = calloc(1, sizeof(struct linked_list));
  struct linked_list *list = (struct linked_list *)*p_list;
  if (NULL != list) {
    list->size = 0;
    list->head = NULL;
  }
  return p_list;
}

size_t size_linked_list(linked_list_type list) {
  if (list == NULL) {
    return 0;
  }
  return ((struct linked_list *)list)->size;
}
bool empty_linked_list(linked_list_type list) {
  return size_linked_list(list) <= 0;
}

linked_list_type add_linked_list(linked_list_type list, elem_type elem) {
  if (NULL == list) {
    return list;
  }

  add_node(list, get_node(list, 0), elem);
  return list;
}

linked_list_type add_by_index_linked_list(linked_list_type list, size_t index,
                                          elem_type elem) {
  if (NULL == list)
    return list;

  add_node(list, get_node(list, index), elem);
  return list;
}

linked_list_type foreach_linked_list(linked_list_type list, callback fun) {

  if (NULL == list)
    return list;

  struct linked_node *p_cur = ((struct linked_list *)list)->head;
  while (p_cur != NULL) {
    fun(p_cur->elem);
    p_cur = p_cur->next;
  }

  return list;
}

linked_list_type get_linked_list(linked_list_type list, size_t index,
                                 callback fun) {
  if (NULL == list)
    return list;
  struct linked_node *node = get_node(list, index);
  if (NULL != node) {
    fun(node->elem);
  }
  return list;
}
linked_list_type remove_linked_list(linked_list_type list, size_t index,
                                    callback fun) {
  if (NULL == list)
    return list;

  struct linked_node *p_node = get_node(list, index);
  if (NULL != p_node) {
    struct linked_list *mylist = (struct linked_list *)list;

    if (mylist->head == p_node) {
      mylist->head = p_node->next;
    }

    if (NULL != p_node->prev)
      p_node->prev->next = p_node->next;
    if (NULL != p_node->next)
      p_node->next->prev = p_node->prev;

    free(p_node);
    --(mylist->size);
  }
  return list;
}
linked_list_type clear_linked_list(linked_list_type list) {
  if (NULL == list)
    return list;

  struct linked_list *mylist = (struct linked_list *)list;
  struct linked_node *p_node = mylist->head;

  while (NULL != p_node) {
    struct linked_node *p_temp = p_node->next;
    free(p_node);
    p_node = p_temp;
  }

  mylist->size = 0;
  return list;
}
linked_list_type destory_linked_list(linked_list_type *p_list) {
  if (NULL == p_list)
    return p_list;

  clear_linked_list(*p_list);
  free(*p_list);
  *p_list = NULL;
  return p_list;
}

static void add_node(linked_list_type list, struct linked_node *node,
                     elem_type elem) {
  // create a new node
  struct linked_node *new_node =
      (struct linked_node *)calloc(1, sizeof(struct linked_node));
  if (NULL == new_node)
    return;
  new_node->elem = elem;

  struct linked_list *mylist = (struct linked_list *)list;
  if (node == mylist->head || NULL == node) {
    if (NULL == node)
      node = mylist->head;
    mylist->head = new_node;
  }
  if (NULL != node) {
    new_node->next = node;
    if (NULL != node->prev) {
      new_node->prev = node->prev;
      node->prev->next = new_node;
    }
    node->prev = new_node;
  }
  ++(mylist->size);
}

static struct linked_node *get_node(linked_list_type list, size_t index) {
  if (size_linked_list(list) <= index)
    return NULL;

  struct linked_node *p_cur = ((struct linked_list *)list)->head;
  for (; index > 0; --index)
    p_cur = p_cur->next;
  return p_cur;
}
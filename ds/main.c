#include "./list/list.h"
#include "./sort/sort.h"
#include "./tree/tree.h"
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int cmp(elem_type a, elem_type b) {
  return ((struct people *)a)->age - ((struct people *)b)->age;
}

void print(elem_type elem) {
  printf(" {age: %d} ", ((struct people *)elem)->age);
}

void update(elem_type elem) { ((struct people *)elem)->age = 44444; }

void test_list(void) {
  size_t size = 10;
  struct people *peoples[10] = {0};
  for (int i = 0; i < size; ++i) {
    peoples[i] = (struct people *)malloc(sizeof(struct people));
    peoples[i]->age = rand() % (size * 10);
  }

  linked_list_type list = NULL;
  init_linked_list(&list);

  /** test functions when linked list is empty  */
  remove_linked_list(list, 0, print);
  get_linked_list(list, 0, print);
  size_linked_list(list);
  empty_linked_list(list);
  foreach_linked_list(list, print);
  clear_linked_list(list);

  /** test at normal case */
  printf("%-45s", "add node at posittion 143: ");
  add_by_index_linked_list(list, 143, peoples[0]);
  foreach_linked_list(list, print);
  putchar('\n');

  printf("%-45s", "add node at header: ");
  add_linked_list(list, peoples[1]);
  foreach_linked_list(list, print);
  putchar('\n');

  printf("%-45s", "update the node's element at position 0: ");
  get_linked_list(list, 0, update);
  foreach_linked_list(list, print);
  putchar('\n');

  printf("%-45s", "get the node's element at position 0: ");
  get_linked_list(list, 0, print);
  putchar('\n');

  printf("%-45s", "remove the node at posistion 0: ");
  remove_linked_list(list, 0, NULL);
  foreach_linked_list(list, print);
  putchar('\n');

  printf("%-45s", "clear all nodes and destory the linked list: ");
  destory_linked_list(&list);
  foreach_linked_list(list, print);
  putchar('\n');

  for (int i = 0; i < size; ++i) {
    free(peoples[i]);
  }
}

void test_quicksort(void) {
  size_t size = 10;
  struct people *peoples[10] = {0};
  for (int i = 0; i < size; ++i) {
    peoples[i] = (struct people *)malloc(sizeof(struct people));
    peoples[i]->age = rand() % (size * 10);
  }

  // use quick sort
  printf("%-20s", "Before sorting: ");
  for (int i = 0; i < size; ++i) {
    print(peoples[i]);
  }
  putchar('\n');

  printf("%-20s", "quick sort: ");
  quicksort((elem_type *)peoples, size, cmp, print);
  putchar('\n');

  printf("%-20s", "After sorting: ");
  for (int i = 0; i < size; ++i) {
    print(peoples[i]);
  }
  putchar('\n');

  // free array's elements' memory
  for (int i = 0; i < size; ++i) {
    free(peoples[i]);
  }
}

void test_mirros(void) {
  /** create a simple binary tree */
  size_t size = 5;
  struct tree_node *nodes[5] = {0};
  for (long i = 0; i < size; ++i) {
    nodes[i] = (struct tree_node *)malloc(sizeof(struct tree_node *) * size);
    nodes[i]->elem = (struct people *)malloc(sizeof(struct people));
    ((struct people *)nodes[i]->elem)->age = i;
    nodes[i]->left = NULL;
    nodes[i]->right = NULL;
    nodes[i]->parent = NULL;
  }

  nodes[0]->left = nodes[1];
  nodes[0]->right = nodes[2];
  nodes[1]->left = nodes[3];
  nodes[1]->right = nodes[4];
  nodes[1]->parent = nodes[0];
  nodes[2]->parent = nodes[0];
  nodes[3]->parent = nodes[1];
  nodes[4]->parent = nodes[1];

  printf("%-40s", "get the binary tree's recursive state: ");
  morris(nodes[0], print);
  putchar('\n');

  printf("%-40s", "traversal through preorder: ");
  morris_prev(nodes[0], print);
  putchar('\n');
  printf("%-40s", "traversal through inorder: ");
  morris_in(nodes[0], print);
  putchar('\n');
  printf("%-40s", "traversal through postorder: ");
  morris_post(nodes[0], print);
  putchar('\n');

  for (int i = 0; i < size; ++i) {
    free(nodes[i]);
  }
}

int main(void) {
  srand((unsigned)time(NULL));

  printf("\n\ntesting the linked list......\n");
  test_list();

  printf("\n\ntesting the quick sort......\n");
  test_quicksort();

  printf("\n\ntesting the binary tree cueing......\n");
  test_mirros();
  return 0;
}

#include "./tree.h"

/**
 * @brief morris algorithm template
 *
 * @param node
 */
void morris(struct tree_node *node, callback fun) {
  if (NULL == node) {
    return;
  }

  struct tree_node *most_right = NULL;
  while (NULL != node) {
    most_right = node->left;
    if (NULL != most_right) {
      while (NULL != most_right->right && most_right->right != node) {
        most_right = most_right->right;
      }

      if (NULL == most_right->right) {
        // print
        fun(node->elem);

        // first
        most_right->right = node;
        node = node->left;
        continue;
      } else {
        // seconed
        most_right->right = NULL;
      }
    } else {
      // print
      fun(node->elem);
    }
    // print
    fun(node->elem);
    node = node->right;
  }
}

void morris_pre(struct tree_node *node, callback fun) {

  if (NULL == node) {
    return;
  }

  struct tree_node *most_right = NULL;
  while (NULL != node) {
    most_right = node->left;
    if (NULL != most_right) {
      while (NULL != most_right->right && most_right->right != node) {
        most_right = most_right->right;
      }

      if (NULL == most_right->right) {
        fun(node->elem);
        most_right->right = node;
        node = node->left;
        continue;
      } else {
        most_right->right = NULL;
      }
    } else {
      fun(node->elem);
    }
    node = node->right;
  }
}

void morris_in(struct tree_node *node, callback fun) {
  if (NULL == node) {
    return;
  }

  struct tree_node *most_right = NULL;
  while (NULL != node) {
    most_right = node->left;
    if (NULL != most_right) {
      while (NULL != most_right->right && most_right->right != node) {
        most_right = most_right->right;
      }

      if (NULL == most_right->right) {
        most_right->right = node;
        node = node->left;
        continue;
      } else {
        most_right->right = NULL;
      }
    }

    fun(node->elem);
    node = node->right;
  }
}

/**
 * @brief reverse the right edge
 *
 * @param from
 * @return
 */
struct tree_node *reverse_edge(struct tree_node *from) {
  struct tree_node *pre = NULL;
  struct tree_node *next = NULL;

  while (NULL != from) {
    next = from->right;
    from->right = pre;
    pre = from;
    from = next;
  }
  return pre;
}

void foreach_edge(struct tree_node *head, callback fun) {
  struct tree_node *tail = reverse_edge(head);
  struct tree_node *node = tail;
  while (NULL != node) {
    fun(node->elem);
    node = node->right;
  }
  reverse_edge(tail);
}

/**
 * @brief
 *
 * @param node
 * @param fun
 */
void morris_post(struct tree_node *node, callback fun) {
  if (NULL == node) {
    return;
  }

  struct tree_node *head = node;
  struct tree_node *most_right = NULL;
  while (NULL != node) {
    most_right = node->left;
    if (NULL != most_right) {
      while (NULL != most_right->right && most_right->right != node) {
        most_right = most_right->right;
      }

      if (NULL == most_right->right) {
        most_right->right = node;
        node = node->left;
        continue;
      } else {
        most_right->right = NULL;
        foreach_edge(node->left, fun);
      }
    }
    node = node->right;
  }

  foreach_edge(head, fun);
}

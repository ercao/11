//
// Created by ercao on 11/4/21.
//

#ifndef MST_TEST_TEST_H_
#define MST_TEST_TEST_H_
#include "../include/dsu.h"
#include "../include/heap.h"
#include "../include/graph.h"

#include <string>
#include <iostream>

using namespace std;

struct People {
 public:
  bool operator<(const People &people) const {
    int name_cmp = name.compare(people.name);
    return name_cmp < 0 || (name_cmp == 0 && age < people.age);
  }

  bool operator>(const People &people) const {
    int name_cmp = name.compare(people.name);
    return name_cmp > 0 || (name_cmp == 0 && age > people.age);
  }

  bool operator==(const People &people) const {
    return name == people.name && age == people.age;
  }

 public:
  struct Equal {
    bool operator()(const People &people1, const People &people2) const {
      return people1.name == people2.name && people1.age == people2.age;
    }
  };
  struct Hash {
    size_t operator()(const People &people) const {
      return hash<string>()(people.name) ^ hash<unsigned>()(people.age);
    }
  };
 public:
  string name;
  unsigned age;
};

ostream &operator<<(ostream &os, const People &people);

void testDsu();
void testHeap();

void testGraph();

#endif //MST_TEST_TEST_H_

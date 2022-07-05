cmake_minimum_required(VERSION 3.0.0)
project(ds VERSION 0.1.0)

include(CTest)
enable_testing()

add_executable(ds 
  ./def.h ./main.c 
  ./tree/tree.h ./tree/tree.c
  ./list/list.h ./list/list.c
  ./sort/sort.h ./sort/sort.c
)

set(CPACK_PROJECT_NAME ${PROJECT_NAME})
set(CPACK_PROJECT_VERSION ${PROJECT_VERSION})
include(CPack)

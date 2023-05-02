cmake_minimum_required(VERSION 3.0.0)
project(ds VERSION 0.1.0)

add_executable(ds 
  ./main.c 
  ./tree/tree.c
  ./list/list.c
  ./sort/sort.c
)

target_include_directories(ds
    PRIVATE
        ${PROJECT_SOURCE_DIR}/include
)

install(TARGETS ds)


cmake_minimum_required(VERSION 3.21)
project(mst)

set(CMAKE_CXX_STANDARD 20)

add_executable(mst
        main.cc
        include/graph.h
        include/heap.h
        include/dsu.h
        test/test.cc test/test.h)

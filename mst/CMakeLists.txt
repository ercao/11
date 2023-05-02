cmake_minimum_required(VERSION 3.21)
project(mst)

set(CMAKE_CXX_STANDARD 20)

add_executable(mst
        main.cc
        test/test.cc 
)

target_include_directories(mst
    PRIVATE
        ${PROJECT_SOURCE_DIR}/include
        ./test/
)

install(TARGETS mst)


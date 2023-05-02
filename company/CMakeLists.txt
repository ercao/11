cmake_minimum_required(VERSION 3.0.0)
project(company-ms VERSION 0.1.0)


add_executable(company-ms
  ./src/connection.cc
  ./src/department-dao.cc
  ./src/department-service.cc
  ./src/employee-dao.cc
  ./src/employee-service.cc
  ./src/main.cc
  ./src/menu.cc
  ./src/print.cc
  ./src/role-dao.cc
  ./src/role-service.cc
  ./src/system-dao.cc
  ./src/system-service.cc
)

target_include_directories(company-ms
    PRIVATE
        ${PROJECT_SOURCE_DIR}/include
)

target_link_libraries(company-ms
    mysqlcppconn8
)


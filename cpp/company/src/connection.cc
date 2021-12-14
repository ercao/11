#include "../include/connection.h"
std::shared_ptr<mysqlx::Session> Connection::session_ = nullptr;
std::shared_ptr<mysqlx::Schema> Connection::schema_ = nullptr;

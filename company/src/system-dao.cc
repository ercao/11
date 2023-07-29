#include "../include/dao.h"
shared_ptr<SystemDao> SystemDao::INSTANCE;
shared_ptr<SystemDao> SystemDao::getInstance() {
  if (INSTANCE == nullptr) {
    INSTANCE = shared_ptr<SystemDao>(new SystemDao());
  }
  return INSTANCE;
}

shared_ptr<System> SystemDao::login(std::string username,
                                    std::string password) {
  auto system = getSystemInfo(username);
  if (system->password() != password) {
    throw std::string("密码错误");
  }
  return system;
}

shared_ptr<System> SystemDao::getSystemInfo(string username) {
  auto row_result =
      table_->select("username", "password", "unix_timestamp(login_time)")
          .where("`username`=" + Util::quote(username))
          .execute();
  if (row_result.count() <= 0) {
    throw std::string("用户不存在");
  }
  mysqlx::Row row = row_result.fetchOne();

  return shared_ptr<System>(
      new System(Util::utf8_to_string(row[0].get<string>()),
                 Util::utf8_to_string(row[1].get<string>()), row[2]));
}

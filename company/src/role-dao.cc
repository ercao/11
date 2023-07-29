#include "../include/dao.h"
shared_ptr<RoleDao> RoleDao::INSTANCE;
shared_ptr<RoleDao> &RoleDao::getInstance() {
  if (INSTANCE == nullptr) {
    INSTANCE = shared_ptr<RoleDao>(new RoleDao());
  }
  return INSTANCE;
}

shared_ptr<PageInfo<Role>> RoleDao::getList(int page_no, int page_size) {
  auto row_result = table_->select("id", "name")
                        .limit(page_size)
                        .offset((page_no - 1) * page_size)
                        .execute();
  vector<shared_ptr<Role>> roles;
  for (auto row : row_result) {
    roles.push_back(shared_ptr<Role>(
        new Role(row[0], Util::utf8_to_string(row[1].get<string>()))));
  }
  return shared_ptr<PageInfo<Role>>(
      new PageInfo<Role>(page_no, page_size, table_->count(), roles));
}

string RoleDao::getRoleName(int role_id) {
  auto row_result =
      table_->select("name").where("`id`=" + to_string(role_id)).execute();
  if (row_result.count() <= 0) {
    throw string("不存在该角色");
  }
  return Util::utf8_to_string(row_result.fetchOne()[0].get<string>());
}

double RoleDao::getMonthSalary(int employee_id, int role_id) {
  auto row_result = table_->select("month_salary")
                        .where("`id`=" + to_string(role_id))
                        .execute();
  if (row_result.count() <= 0) {
    throw string("不存在该角色");
  }
  auto s = row_result.fetchOne()[0];
  if (s.isNull()) {
    throw string("该角色工资无法计算");
  }
  auto result = table_->getSession()
                    .sql(Util::utf8_to_string(s.get<string>()))
                    .bind("employee_id", employee_id)
                    .execute();
  if (result.count() <= 0) {
    throw string("不存在该员工");
  }
  return result.fetchOne()[0];
}

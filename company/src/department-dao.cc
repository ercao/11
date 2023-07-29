#include "../include/dao.h"
shared_ptr<DepartmentDao> DepartmentDao::INSTANCE;
shared_ptr<DepartmentDao> &DepartmentDao::getInstance() {
  if (INSTANCE == nullptr) {
    INSTANCE = shared_ptr<DepartmentDao>(new DepartmentDao());
  }
  return INSTANCE;
}

shared_ptr<PageInfo<Department>> DepartmentDao::getList(int page_no,
                                                        int page_size) {
  auto row_result = table_->select("id", "name", "manager_id", "sales")
                        .where("`deleted`<>true")
                        .limit(page_size)
                        .offset((page_no - 1) * page_size)
                        .execute();
  vector<shared_ptr<Department>> departments;
  for (auto row : row_result) {
    departments.push_back(fill(row));
  }
  return shared_ptr<PageInfo<Department>>(new PageInfo<Department>(
      page_no, page_size, table_->count(), departments));
}

shared_ptr<Department> DepartmentDao::getOne(int id) {
  auto row_result = table_->select("id", "name", "manager_id", "sales")
                        .where("`id`=" + to_string(id) + " and `deleted`<>true")
                        .execute();
  if (row_result.count() > 0) {
    return fill(row_result.fetchOne());
  }
  return nullptr;
}

int DepartmentDao::add(const Department &department) {
  int count =
      (int)table_->insert("name", "sales")
          .values(Util::string_to_utf8(department.name()), department.sale())
          .execute()
          .getAffectedItemsCount();
  if (department.managerId() != 0) {
    string name = department.name();
    table_->update()
        .set("manager_id", department.managerId())
        .where("`name`=" + Util::string_to_utf8(Util::quote(name)) +
               " and `deleted`<>true")
        .execute();
  };
  return count;
}

int DepartmentDao::remove(int id) {
  auto old_department = getOne(id);
  if (old_department == nullptr) {
    throw string("该部门不存在");
  }
  return (int)table_->update()
      .set("deleted", true)
      .where("`id`=" + to_string(id) + " and `deleted`<>true")
      .execute()
      .getAffectedItemsCount();
}

int DepartmentDao::update(const Department &department) {
  auto up = table_->update()
                .set("name", Util::string_to_utf8(department.name()))
                .set("sales", department.sale());
  if (department.managerId() >= 10000) {
    up = up.set("manager_id", department.managerId());
  }
  return (int)up
      .where("`id`=" + to_string(department.id()) + " and `deleted`<>true")
      .execute()
      .getAffectedItemsCount();
}

int DepartmentDao::setManagerIdNull(int manager_id) {
  return (int)table_->getSession()
      .sql("update `department` set `manager_id` := null where `manager_id`=" +
           to_string(manager_id))
      .execute()
      .getAffectedItemsCount();
  ;
}

shared_ptr<Department> DepartmentDao::fill(const mysqlx::Row &row) {
  shared_ptr<Department> department(new Department());
  department->setId(row[0]);
  department->setName(Util::utf8_to_string(row[1].get<string>()));

  if (!row[2].isNull()) {
    department->setManager(row[2], "");
  }
  department->setSale(row[3]);
  return department;
}

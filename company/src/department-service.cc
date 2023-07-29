#include "../include/service.h"

ResultEntity<PageInfo<Department>>
DepartmentService::getPageInfo(string page_no, string page_size) {
  static const string &GETLIST_FAILD_PREFIX = "获得部门列表失败：";
  try {
    int no = std::stoi(page_no);
    if (no < 1) {
      throw string("页码非法");
    }
    int size = std::stoi(page_size);
    if (size <= 0) {
      throw string("页数非法");
    }
    auto result = department_dao_->getList(no, size);
    for (auto department : result->data_) {
      if (department->managerId() > 0) {
        department->setName(
            employee_dao_->getOne(department->managerId())->name());
      }
    }
    return ResultEntity<PageInfo<Department>>::successResultWidthData(
        "成功获取到" + to_string(result->data_.size()) + "条数据", result);
  } catch (const string &e) {
    return ResultEntity<PageInfo<Department>>::faildResult(
        GETLIST_FAILD_PREFIX + e);
  } catch (const exception &e) {
    return ResultEntity<PageInfo<Department>>::faildResult(
        GETLIST_FAILD_PREFIX + e.what());
  }
}

ResultEntity<Department> DepartmentService::getOne(string id) {
  static const string &GETONE_FAILD_PREFIX = "获得部门信息失败：";
  try {
    int id_ = std::stoi(id);
    if (id_ < 100) {
      throw string("部门编号无效");
    }
    auto department = department_dao_->getOne(id_);
    if (department == nullptr) {
      throw string("没有该部门");
    }
    if (department->managerId() > 0) {
      department->setName(
          employee_dao_->getOne(department->managerId())->name());
    }
    return ResultEntity<Department>::successResultWidthData("获取数据成功",
                                                            department);
  } catch (const string &e) {
    return ResultEntity<Department>::faildResult(GETONE_FAILD_PREFIX + e);
  } catch (const exception &e) {
    return ResultEntity<Department>::faildResult(GETONE_FAILD_PREFIX +
                                                 e.what());
  }
}

ResultEntity<int> DepartmentService::add(Department &object) {
  static const string &ADD_FAILD_PREFIX = "添加部门信息失败：";
  try {
    Connection::startTranscation();
    if (object.id() != 0) {
      throw string("部门编号无效");
    }
    if (object.name() == "") {
      throw string("部门名称为空");
    }
    if (object.sale() < 0 || object.sale() >= 10000000000) {
      throw string("销售额超限");
    }

    if (object.managerId() >= 10000) {
      auto manager = employee_dao_->getOne(object.managerId());
      if (manager == nullptr) {
        throw string("指定员工不存在");
      }
    }
    int count = department_dao_->add(object);
    Connection::commit();
    return ResultEntity<int>::successResultWidthoutData(
        "成功添加" + to_string(count) + "条数据");
  } catch (const string &e) {
    Connection::rollback();
    return ResultEntity<int>::faildResult(ADD_FAILD_PREFIX + e);
  } catch (const exception &e) {
    Connection::rollback();
    return ResultEntity<int>::faildResult(ADD_FAILD_PREFIX + e.what());
  }
}

ResultEntity<int> DepartmentService::edit(Department &department) {
  static const string &EDIT_FAILD_PREFIX = "修改部门信息失败：";
  try {
    Connection::startTranscation();
    if (department.id() < 100) {
      throw string("部门编号无效");
    }
    auto old_department = department_dao_->getOne(department.id());
    if (old_department == nullptr) {
      throw string("该部门不存在");
    }

    if (department.name() == "") {
      department.setName(old_department->name());
    }
    if (department.sale() < 0 || department.sale() > 10000000000) {
      department.setSale(old_department->sale());
    }

    if (department.managerId() < 10000 ||
        nullptr == employee_dao_->getOne(department.managerId())) {
      department.setManager(old_department->managerId(), "");
    }
    int count = department_dao_->update(department);
    // 修改雇员
    Connection::commit();
    return ResultEntity<int>::successResultWidthoutData(
        "成功修改" + to_string(count) + "条数据");
  } catch (const string &e) {
    Connection::rollback();
    return ResultEntity<int>::faildResult(EDIT_FAILD_PREFIX + e);
  } catch (const exception &e) {
    Connection::rollback();
    return ResultEntity<int>::faildResult(EDIT_FAILD_PREFIX + e.what());
  }
}
ResultEntity<int> DepartmentService::remove(string id) {
  static const string &DELETE_FAILD_PREFIX = "删除部门信息失败：";
  try {
    Connection::startTranscation();
    int no = std::stoi(id);
    if (no < 100) {
      throw string("参数无效");
    }
    if (no == 100) {
      throw string("该部门禁止删除");
    }
    int count = department_dao_->remove(no);
    if (count > 0) {
      employee_dao_->setDepartmentIdNull(no);
    }
    Connection::commit();
    return ResultEntity<int>::successResultWidthoutData(
        "成功删除" + to_string(count) + "条数据");
  } catch (const string &e) {
    Connection::rollback();
    return ResultEntity<int>::faildResult(DELETE_FAILD_PREFIX + e);
  } catch (const exception &e) {
    Connection::rollback();
    return ResultEntity<int>::faildResult(DELETE_FAILD_PREFIX + e.what());
  }
}

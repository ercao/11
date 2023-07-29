#include "../include/service.h"

ResultEntity<System> SystemService::login(string username, string password,
                                          const string &code) {
  static const string &LOGIN_SUCCESSED = "登录成功";
  static const string &LOGIN_FAILED = "登录失败：";
  try {
    if (Util::trim(username) == "") {
      throw string("用户名不能为空");
    }
    if (Util::trim(password) == "") {
      throw string("密码不能为空");
    }
    if (time(nullptr) - last_code_time > 60) {
      throw string("验证码失效请重新获取");
    }

    return ResultEntity<System>::successResultWidthData(
        "登录成功", system_dao_->login(username, password));
  } catch (const string &e) {
    return ResultEntity<System>::faildResult(LOGIN_FAILED + e);
  } catch (const exception &e) {
    return ResultEntity<System>::faildResult(LOGIN_FAILED + e.what());
  }
}

ResultEntity<System> SystemService::getSystemInfo() {
  static const string &GETSYSTEM_SUCCESSED = "获取系统信息失败：";
  try {
    if (system_info_ == nullptr) {
      throw string("您未登录，请先登录");
    }

    return ResultEntity<System>::successResultWidthData(
        "获取系统信息成功",
        system_dao_->getSystemInfo(system_info_->username()));
  } catch (const string &e) {
    return ResultEntity<System>::faildResult(GETSYSTEM_SUCCESSED + e);
  } catch (const exception &e) {
    return ResultEntity<System>::faildResult(GETSYSTEM_SUCCESSED + e.what());
  }
}

ResultEntity<string> SystemService::getVerificationCode(int length) {
  static const string &GETCODE_SUCCESSED = "获取验证码成功";
  static const string &GEGCODE_FAILED = "获取验证码失败：";

  try {
    if (length < 4) {
      throw string("length < 4");
    }
    code = "";
    srand(static_cast<unsigned int>(time(nullptr)));
    for (int i = 0; i < length; ++i) {
      code += ((rand() & 1) ? 'a' : 'A') + (rand() % 26);
    }
    last_code_time = time(nullptr);
    return ResultEntity<string>::successResultWidthData(
        GETCODE_SUCCESSED, shared_ptr<string>(new string(code)));
  } catch (const string &e) {
    return ResultEntity<string>::faildResult(GEGCODE_FAILED + e);
  } catch (const exception &e) {
    return ResultEntity<string>::faildResult(GEGCODE_FAILED + e.what());
  }
}

ResultEntity<int> SystemService::exportData(const string &filename) {
  static const string &EXPORT_FILE_FAILD_PREFIX = "导入数据失败：";
  try {
    // 输出到文件
    ofstream ofs(filename, ios::out);
    if (!ofs.is_open()) {
      throw string("文件打开失败");
    }

    // 导出数据
    EmployeeService employee_service;
    auto employees = employee_service.getPageInfo("1", to_string(INT_MAX));
    DepartmentService department_service;
    auto departments = department_service.getPageInfo("1", to_string(INT_MAX));
    int employees_count = 0, department_count = 0;

    // 转为json
    using json = nlohmann::json;
    json data;

    // 保存部门信息
    data["departments"] = json::array();
    for (auto d : departments.data_->data_) {
      json j;
      j["id"] = d->id();
      j["name"] = Util::string_to_utf8(d->name());
      j["manager"] = Util::string_to_utf8(d->managerName());
      j["sales"] = d->sale();
      data["departments"].push_back(j);
      ++department_count;
    }

    // 保存官员信息
    data["employees"] = json::array();
    for (auto e : employees.data_->data_) {
      json j;
      // TODO
      j["id"] = e->id();
      j["username"] = Util::string_to_utf8(e->username());
      j["password"] = Util::string_to_utf8(e->password());
      j["name"] = Util::string_to_utf8(e->name());
      j["gender"] = Util::string_to_utf8(e->gender());
      j["age"] = e->age();
      j["workedTime"] = e->workedTime();
      j["salary"] = e->salary();
      j["department"] = Util::string_to_utf8(e->departmentName());
      j["role"] = Util::string_to_utf8(e->roleName());
      j["createTime"] = e->createTime();
      j["updateTime"] = e->updateTime();
      data["employees"].push_back(j);
      ++employees_count;
    }

    ofs << data.dump();
    ofs.close();
    return ResultEntity<int>::successResultWidthoutData(
        string("导出数据成功：")
            .append(to_string(department_count))
            .append(" 条部门信息记录，")
            .append(to_string(employees_count))
            .append(" 条员工信息记录"));
  } catch (const string &e) {
    return ResultEntity<int>::faildResult(EXPORT_FILE_FAILD_PREFIX + e);
  } catch (const exception &e) {
    return ResultEntity<int>::faildResult(EXPORT_FILE_FAILD_PREFIX + e.what());
  }
  return ResultEntity<int>::faildResult("未实现该功能");
}

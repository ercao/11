#include "../include/menu.h"
#include <cstdio>

int main() {
  try {
    Menu menu;
    menu.stage();

    // SystemService system_service;
    // auto code = system_service.getVerificationCode().data_;
    // cout << *code << endl;
    // auto result = system_service.login("root", "张三", *code);
    // cout << result.msg_ << endl;
    // auto system = result.data_;
    // cout << system->username();

    // 测试 roleService
    // auto result_1_1 = role_dao.getRoleName(1000);
    // cout << result_1_1 << std::endl;

    // auto result_1_2 = role_dao.getList(1, 5);
    // cout << result_1_2 << std::endl;

    //// 测试 DepartmentService
    // DepartmentService department_service;
    // auto result1 = department_service.getPageInfo();
    // cout << result1.msg_ << endl;
    // cout << result1.data_ << endl;

    // EmployeeService employee_service;
    // auto result2 = employee_service.getPageInfo();
    // cout << result2.msg_ << endl;

    // Department de;
    // de.setId(100);
    // de.setManager(10001, "");
    // de.setName("普通部门");
    // auto result3 = department_service.edit(de);
    // cout << result3.msg_ << endl;

    // auto result4 = department_service.getOne("100");
    // cout << result4.msg_ << endl;

    // auto result5 = employee_service.getOne("10000");
    // cout << result5.msg_ << endl;

    // auto result6 = employee_service.getMonthSalary(*result5.data_);
    // cout << result6.msg_ << endl;
    // cout << *result6.data_ << endl;
  } catch (exception &e) {
    cout << e.what() << endl;
  }
}

void test() {
  try {
    shared_ptr<SystemService> system_service;
    // auto result1 = system_service.exportData();
    // cout << result1.msg_ << endl;

    // 获得系统信息
    ResultEntity<System> result3 = system_service->getSystemInfo();
    cout << result3.msg_ << endl;

    // 获取验证码
    auto result2 = system_service->getVerificationCode(5);
    cout << result2.msg_ << endl;

    // 登录
    auto result4 = system_service->login("root", "123456", *result2.data_);
    cout << result4.msg_ << endl;

    // 获得系统信息
    auto result5 = system_service->getSystemInfo();
    cout << result5.msg_ << endl;

    // 部门服务
    DepartmentService department_service;
    auto result = department_service.getPageInfo();
    auto data = result.data_;

    auto result4313 = department_service.getOne("1");
    cout << result4313.data_ << endl;
    cout << data << endl;
    cout << result.msg_ << endl;
    cout << department_service.getOne("0").msg_ << endl;
    Department d;
    cout << department_service.add(d).msg_ << endl;
    cout << department_service.remove("1").msg_ << endl;
    cout << department_service.edit(d).msg_ << endl;
    auto resultreqwre = department_service.getPageInfo();
    cout << resultreqwre.data_ << endl;

    // 雇员服务
    EmployeeService employee_service;
    auto resutlt10 = employee_service.getPageInfo();
    cout << resutlt10.msg_ << endl;
    cout << resutlt10.data_ << endl;
    cout << employee_service.getOne("0").msg_ << endl;
    // cout << employee_service.add(m).msg_ << endl;
    // cout << employee_service.remove("1").msg_ << endl;
    // cout << employee_service.edit(m).msg_ << endl;
  } catch (exception &e) {
    cout << e.what() << endl;
  }
}

#ifndef __SERVICE_H__
#define __SERVICE_H__

#include "dao.h"
#include <climits>
#include <fstream>
#include <nlohmann/json.hpp>


class Service {
protected:
  shared_ptr<SystemDao> system_dao_ = SystemDao::getInstance();
  shared_ptr<DepartmentDao> department_dao_ = DepartmentDao::getInstance();
  shared_ptr<EmployeeDao> employee_dao_ = EmployeeDao::getInstance();
  shared_ptr<RoleDao> role_dao_ = RoleDao::getInstance();
};
/**
 * @brief 部门相关 Service
 */
class DepartmentService final : public Service {
public:
  /**
   * @brief 获取分页数据
   * @param page_no 当前页
   * @param page_size 每一页的大小
   * @return
   */
  ResultEntity<PageInfo<Department>> getPageInfo(string page_no = "1",
                                                 string page_size = "5");

  /**
   * @brief 展示详情页
   * @param employee
   */
  ResultEntity<Department> getOne(string id);

  /**
   * @brief 展示添加页
   * @return
   */
  ResultEntity<int> add(Department &department);

  /**
   * @brief 展示编辑页
   * @param employee
   * @return
   */
  ResultEntity<int> edit(Department &department);

  /**
   * @brief 删除
   * @param object
   * @return
   */
  ResultEntity<int> remove(string id);
};

/**
 * @brief 雇员相关 Serivce 层
 */
class EmployeeService final : public Service {
public:
  /**
   * @brief 获取分页数据
   * @param page_no 当前页
   * @param page_size 每一页的大小
   * @return
   */
  ResultEntity<PageInfo<Employee>> getPageInfo(string page_no = "1",
                                               string page_size = "5");

  /**
   * @brief 展示详情页
   * @param employee
   */
  ResultEntity<Employee> getOne(string id);

  /**
   * @brief 展示添加页
   * @return
   */
  ResultEntity<int> add(Employee &Object);

  /**
   * @brief 展示编辑页
   * @param employee
   * @return
   */
  ResultEntity<int> edit(Employee &Object);

  /**
   * @brief 删除
   * @param object
   * @return
   */
  ResultEntity<int> remove(string id);

  /**
   * @brief 获得月工资
   * @return
   */
  ResultEntity<double> getMonthSalary(Employee &employee);

private:
  void fillDepartmentAndRole(shared_ptr<Employee> &employee);
};

/**
 * @brief 角色服务
 */
class RoleService : public Service {
public:
  ResultEntity<PageInfo<Role>> getList(const string &page_no = "1",
                                       const string &page_size = "5");
};

/**
 * @brief 系统相关 Service
 */
class SystemService final : public Service {
public:
  /**
   * @brief 登录接口
   * @return
   */
  ResultEntity<System> login(string username, string password,
                             const string &code);

  /**
   * @brief 获得系统信息
   * @return
   */
  ResultEntity<System> getSystemInfo();

  /**
   * @brief 获得验证码
   * @return
   */
  ResultEntity<string> getVerificationCode(int length = 4);

  /**
   * @brief 导出数据
   */
  ResultEntity<int> exportData(const string &filename = "./data.json");

protected:
  shared_ptr<System> system_info_ = nullptr;
  string code = "";
  time_t last_code_time = 0; // 上一次获取验证码的时间
};
#endif // !__SERVICE_H__

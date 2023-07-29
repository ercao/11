#ifndef __ENTITY_H__
#define __ENTITY_H__
#include <memory>
#include <string>
#include <vector>

using namespace std;

/**
 * @brief service 和 controller 交互使用的类
 */
template <typename T> class ResultEntity final {
public:
  const bool result_;
  const string msg_;
  shared_ptr<T> data_;

  ResultEntity(bool result, const string &msg, const shared_ptr<T> &data)
      : result_(result), msg_(msg), data_(data) {}
  /**
   * @brief 返回带数据的结果
   */
  static ResultEntity<T> successResultWidthData(const string &msg,
                                                const shared_ptr<T> &data) {
    return ResultEntity(true, msg, data);
  }
  /**
   * @brief 返回不带数据的结果
   */
  static ResultEntity<T> successResultWidthoutData(const string &msg) {
    return ResultEntity(true, msg, nullptr);
  }

  /**
   * @brief 返回失败结果
   */
  static ResultEntity<T> faildResult(const string &msg) {
    return ResultEntity(false, msg, nullptr);
  }
};

/**
 * @brief 分页信息
 */
template <typename T> class PageInfo final {
public:
  PageInfo(size_t no, size_t page_size, size_t size,
           const vector<shared_ptr<T>> &data)
      : no_(no), page_size_(page_size > size ? size : page_size), size_(size),
        data_(data) {
    pre_ = (no_ <= 0) ? 0 : no_ - 1;
    first_ = 0;
    last_ = (size_ / page_size) + (size_ % page_size_ == 0 ? 0 : 1);
    if (size_ <= 0) {
      last_ = 0;
    }
    next_ = (no_ >= last_) ? no_ : no_ + 1;
  }
  // 第一页
  size_t first_;
  // 上一页
  size_t pre_;
  // 当前页
  size_t no_;
  // 下一页
  size_t next_;
  // 尾页
  size_t last_;
  // 每一页的数据
  size_t page_size_;
  // 所有数据数
  size_t size_;
  // 数据
  const vector<shared_ptr<T>> data_;
};

/**
 * @brief 角色信息
 */
class Role final {
public:
  Role(int id, const string &name) : id_(id), name_(name) {}
  // get 函数
  int id() const { return id_; }
  string name() const { return name_; }

  // set 函数
  void setId(int id) { id_ = id; }
  void setName(const string &name) { name_ = name; }

private:
  int id_{0};     // 角色编号
  string name_{}; // 系统密码
};

/**
 * @brief 系统信息[单例]
 */
class System final {
public:
  System(const string &username, const string &password, time_t login_time)
      : username_(username), password_(password), login_time_(login_time) {}
  // get 函数
  string username() const { return username_; }
  string password() const { return password_; }
  time_t loginTime() const { return login_time_; }

  // set 函数
  void setUsername(const string &username) { username_ = username; }
  void setPassword(const string &password) { password_ = password; }
  void setLoginTime(time_t login_time) { login_time_ = login_time; }

private:
  string username_{};    // 系统用户名
  string password_{};    // 系统密码
  time_t login_time_{0}; // 上次登录时间
};

/**
 * @brief 部门类
 */
class Department final {
public:
  // get 函数
  int id() const { return id_; }
  string name() const { return name_; }
  int managerId() const { return manager_.id_; }
  string managerName() const { return manager_.name_; }
  double sale() const { return sale_; }

  // set 函数
  void setId(int id) { id_ = id; }
  void setName(string name) { name_ = name; }
  void setManager(int id, string name) {
    manager_.id_ = id;
    manager_.name_ = name;
  }
  void setSale(double sale) { sale_ = sale; }

private:
  // 管理者信息
  struct Employee {
    int id_{0};
    string name_{};
  };

  int id_{0};                      // 部门编号
  string name_{};                  // 部门名字
  Department::Employee manager_{}; // 管理者
  double sale_{0};                 // 部门销售额
};

/**
 * @brief 员工类
 */
class Employee final {
public:
  Employee() = default;

  // get 函数
  int id() const { return id_; }
  string username() const { return username_; }
  string password() const { return password_; }
  string name() const { return name_; }
  string gender() const { return gender_; }
  short age() const { return age_; }
  double workedTime() const { return worked_time_; }
  double salary() const { return salary_; }
  int departmentId() const { return department_.id_; }
  string departmentName() const { return department_.name_; }
  int roleId() const { return role_.id_; }
  string roleName() const { return role_.name_; }
  time_t createTime() const { return create_time_; }
  time_t updateTime() { return update_time_; }

  // set 函数
  void setId(int id) { id_ = id; }
  void setUsername(string username) { username_ = username; }
  void setPassword(string password) { password_ = password; }
  void setName(string name) { name_ = name; }
  void setGender(string gender) { gender_ = gender; }
  void setAge(int age) { age_ = age; }
  void setWorkedTime(double work_time) { worked_time_ = work_time; }
  void setSalary(double salary) { salary_ = salary; }
  void setDepartment(int id, const string &name) {
    department_.id_ = id;
    department_.name_ = name;
  }
  void setRole(int id, const string &name) {
    role_.id_ = id;
    role_.name_ = name;
  }
  void setCreateTime(time_t create_time) { create_time_ = create_time; }
  void setUpdateTime(time_t update_time) { update_time_ = update_time; }

private:
  // 部门信息
  struct Department {
    int id_{0};
    string name_{};
  };
  // 角色信息
  struct Role {
    int id_{0};
    string name_{};
  };

  int id_{0};             // 雇员编号
  string username_{};     // 雇员用户名
  string password_{};     // 雇员密码
  string name_{};         // 雇员名字
  string gender_{};       // 雇员性别
  int age_{0};            // 雇员年龄
  double worked_time_{0}; // 雇员工作时间
  double salary_{0};      // 雇员工资：每个职位的意义不同
  Employee::Department department_{}; // 所属部门信息
  Employee::Role role_{};             // 角色信息
  time_t create_time_{0};             // 雇员创建时间
  time_t update_time_{0};             // 账号上一次修改时间
};
#endif // __ENTITY_H__

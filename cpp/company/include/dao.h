#ifndef __DAO_H__
#define __DAO_H__
#include "entity.h"
#include "util.h"
#include "connection.h"
class EmployeeDao;
class DepartmentDao;
class SystemDao;

/**
 * @brief 内存形式的数据层
*/
class DepartmentDao final {
public:
	static shared_ptr<DepartmentDao> &getInstance();

	shared_ptr<PageInfo<Department>> getList(int page_no, int page_size);

	shared_ptr<Department> getOne(int id);

	int add(const Department &department);

	int remove(int id);

	int update(const Department &department);

	int setManagerIdNull(int manager_id);
private:
	shared_ptr<Department> fill(const mysqlx::Row &row);
private:
	shared_ptr<mysqlx::Table> table_{ Connection::getTable("department") };
	static shared_ptr<DepartmentDao> INSTANCE;
};

/**
 * @brief 内存形式的数据层
*/
class EmployeeDao final {
public:
	static shared_ptr<EmployeeDao> &getInstance();

	shared_ptr<PageInfo<Employee>> getList(int page_no, int page_size);

	shared_ptr<Employee> getOne(int id);

	int add(const Employee &employee);

	int remove(int id);

	int update(const Employee &employee);

	int setDepartmentIdNull(int department_id);
	int setRoleIdNull(int role_id);
private:
	shared_ptr<Employee> fill(const mysqlx::Row &row);
private:
	shared_ptr<mysqlx::Table> table_{ Connection::getTable("employee") };
	static shared_ptr<EmployeeDao> INSTANCE;
};

class RoleDao final {
public:
	static shared_ptr<RoleDao> &getInstance();

	shared_ptr<PageInfo<Role>> getList(int page_no, int page_size);
	string  getRoleName(int role_id);
	double  getMonthSalary(int employee_id, int rold_id);
private:
	shared_ptr<mysqlx::Table> table_{ Connection::getTable("role") };
	static shared_ptr<RoleDao> INSTANCE;
};

/**
 * @brief 登录接口
*/
class SystemDao final {
public:
	static shared_ptr<SystemDao> getInstance();
	/**
	 * @brief 登录
	 * @return
	*/
	shared_ptr<System> login(std::string username, std::string password);
	/**
	 * @brief 获取系统信息
	 * @return
	*/
	shared_ptr<System> getSystemInfo(string username);
private:
	shared_ptr<mysqlx::Table> table_{ Connection::getTable("system") };
	static shared_ptr<SystemDao> INSTANCE;
};
#endif // !__DAO_H__

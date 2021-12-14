#include "../include/dao.h"
shared_ptr<EmployeeDao> EmployeeDao::INSTANCE;
shared_ptr<EmployeeDao> &EmployeeDao::getInstance() {
	if (INSTANCE == nullptr) {
		INSTANCE = shared_ptr<EmployeeDao>(new EmployeeDao());
	}
	return INSTANCE;
}

shared_ptr<PageInfo<Employee>> EmployeeDao::getList(int page_no, int page_size) {
	auto row_result = table_->select(
		"id", "username", "password", "name", "gender", "age", "worked_time", "salary", "department_id", "role_id", "unix_timestamp(create_time)", "unix_timestamp(update_time)")
		.where("`deleted`<>true").limit(page_size).offset((page_no - 1) * page_size).execute();

	vector<shared_ptr<Employee>> employees;
	for (auto row : row_result) {
		employees.push_back(fill(row));
	}
	return shared_ptr<PageInfo<Employee>>(new PageInfo<Employee>(page_no, page_size, table_->count(), employees));
}

shared_ptr<Employee> EmployeeDao::getOne(int id) {
	auto row_result = table_->select(
		"id", "username", "password", "name", "gender", "age", "worked_time", "salary", "department_id", "role_id", "unix_timestamp(create_time)", "unix_timestamp(update_time)")
		.where("`id`=" + to_string(id) + "and `deleted`<>true").execute();
	if (row_result.count() > 0) {
		return fill(row_result.fetchOne());
	}
	return nullptr;
}

int EmployeeDao::add(const Employee &employee) {
	int count = (int)table_
		->insert("username", "password", "name", "gender", "age", "salary")
		.values(Util::string_to_utf8(employee.username()), Util::string_to_utf8(employee.password()), Util::string_to_utf8(employee.name()), Util::string_to_utf8(employee.gender()), employee.age(), employee.salary())
		.execute().getAffectedItemsCount();
	// 部门编号
	if (employee.departmentId() != 0) {
		table_->update().set("department_id", employee.departmentId()).where("`id`=" + to_string(employee.id()) + "and `deleted`<>true").execute();
	};
	// 角色编号
	if (employee.roleId() != 0) {
		table_->update().set("role_id", employee.roleId()).where("`id`=" + to_string(employee.id()) + "and `deleted`<>true").execute();
	};
	return count;
}

int EmployeeDao::remove(int id) {
	if (getOne(id) == nullptr) {
		throw string("该员工不存在");
	}
	return (int)table_->update().set("deleted", true).where("`id`=" + to_string(id) + "and `deleted`<>true").execute().getAffectedItemsCount();
}

int EmployeeDao::update(const Employee &employee) {
	return (int)table_->update()
		.set("username", Util::string_to_utf8(employee.username())).set("password", Util::string_to_utf8(employee.password())).set("name", Util::string_to_utf8(employee.name()))
		.set("gender", Util::string_to_utf8((employee.gender()))).set("age", employee.age()).set("worked_time", employee.workedTime())
		.set("salary", employee.salary()).set("department_id", employee.departmentId()).set("role_id", employee.roleId())
		.set("update_time", mysqlx::expr("now()"))
		.where("`id`=" + to_string(employee.id()) + "and `deleted`<>true").execute().getAffectedItemsCount();
}

int EmployeeDao::setDepartmentIdNull(int department_id) {
	return (int)table_->update().set("department_id", 100).where("`department_id`=" + to_string(department_id) + "and `deleted`<>true").execute().getAffectedItemsCount();
}
int EmployeeDao::setRoleIdNull(int role_id) {
	return (int)table_->update().set("role_id", 1000).where("`role_id`=" + to_string(role_id) + "and `deleted`<>true").execute().getAffectedItemsCount();
}

// "id", "username", "password", "name", "gender", "age", "worked_time", "salary", "department_id", "role_id", "create_time", "update_time"
shared_ptr<Employee> EmployeeDao::fill(const mysqlx::Row &row) {
	shared_ptr<Employee> employee(new Employee());

	// 全部非空
	employee->setId(row[0]);
	employee->setUsername(Util::utf8_to_string(row[1].get<string>()));
	employee->setPassword(Util::utf8_to_string(row[2].get<string>()));
	employee->setName(Util::utf8_to_string(row[3].get<string>()));
	employee->setGender(Util::utf8_to_string(row[4].get<string>()));
	employee->setAge(row[5]);
	employee->setWorkedTime(row[6]);
	employee->setSalary(row[7]);
	employee->setDepartment(row[8], "");
	employee->setRole(row[9], "");
	employee->setCreateTime(row[10]);
	employee->setUpdateTime(row[11]);
	return employee;
}

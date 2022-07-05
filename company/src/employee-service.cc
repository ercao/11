#include "../include/service.h"
ResultEntity<PageInfo<Employee>> EmployeeService::getPageInfo(string page_no, string page_size) {
	static const string &GETLIST_FAILD_PREFIX = "获得雇员列表失败：";
	try {
		int no = std::stoi(page_no);
		if (no <= 0) {
			throw string("页码非法");
		}

		int size = std::stoi(page_size);
		if (size <= 0) {
			throw string("页数非法");
		}
		auto result = employee_dao_->getList(no, size);
		for (auto employee : result->data_) {
			fillDepartmentAndRole(employee);
		}
		return ResultEntity<PageInfo<Employee>>::successResultWidthData("成功获取到" + to_string(result->data_.size()) + "条数据", result);
	} catch (const string &e) {
		return ResultEntity<PageInfo<Employee>>::faildResult(GETLIST_FAILD_PREFIX + e);
	} catch (const exception &e) {
		return ResultEntity<PageInfo<Employee>>::faildResult(GETLIST_FAILD_PREFIX + e.what());
	}
}

ResultEntity<Employee> EmployeeService::getOne(string id) {
	static const string &GETLIST_FAILD_PREFIX = "获得雇员信息失败：";
	try {
		int no = std::stoi(id);
		if (no <= 0) {
			throw string("参数无效");
		}
		auto employee = employee_dao_->getOne(no);
		if (employee == nullptr) {
			throw string("没有雇员");
		}
		fillDepartmentAndRole(employee);
		return ResultEntity<Employee>::successResultWidthData("获取数据成功", employee);
	} catch (const string &e) {
		return ResultEntity<Employee>::faildResult(GETLIST_FAILD_PREFIX + e);
	} catch (const exception &e) {
		return ResultEntity<Employee>::faildResult(GETLIST_FAILD_PREFIX + e.what());
	}
}

ResultEntity<int> EmployeeService::add(Employee &object) {
	static const string &GETLIST_FAILD_PREFIX = "添加雇员信息失败：";
	try {
		Connection::startTranscation();
		if (object.id() != 0) {
			throw string("参数无效");
		}
		if (object.username() == "") {
			throw string("用户名不能为空");
		}
		if (object.password() == "") {
			throw string("密码不能为空");
		}
		if (object.name() == "") {
			throw string("名字不能为空");
		}
		if (object.gender() == "" && object.gender() != "男" && object.gender() != "女") {
			throw string("性别不能为空");
		}

		if (object.age() < 0 || object.age() > 120) {
			throw string("年龄超限");
		}

		if (object.salary() < 0 || object.salary() >= 1000000000) {
			throw string("工资超限");
		}
		// 部门
		if (object.departmentId() >= 100) {
			if (department_dao_->getOne(object.departmentId()) == nullptr) {
				throw string("指定部门不存在");
			}
		} else {
			throw string("部门编号有误");
		}
		// 角色
		if (object.roleId() >= 1000) {
			if (role_dao_->getRoleName(object.roleId()) == "") {
				throw string("指定角色不存在");
			}
		} else {
			throw string("角色编号有误");
		}
		int count = employee_dao_->add(object);
		Connection::commit();
		return ResultEntity<int>::successResultWidthoutData("成功添加" + to_string(count) + "条数据");
	} catch (const string &e) {
		Connection::rollback();
		return ResultEntity<int>::faildResult(GETLIST_FAILD_PREFIX + e);
	} catch (const exception &e) {
		Connection::rollback();
		return ResultEntity<int>::faildResult(GETLIST_FAILD_PREFIX + e.what());
	}
}

ResultEntity<int> EmployeeService::edit(Employee &object) {
	static const string &GETLIST_FAILD_PREFIX = "编辑员工信息失败：";
	try {
		Connection::startTranscation();
		if (object.id() <= 0) {
			throw string("参数无效");
		}
		auto employee = employee_dao_->getOne(object.id());
		if (employee == nullptr) {
			throw string("没有雇员");
		}
		if (object.username() == "") {
			object.setUsername(employee->username());
		}
		if (object.password() == "") {
			object.setPassword(employee->password());
		}
		if (object.name() == "") {
			object.setPassword(employee->name());
		}
		if (object.gender() == "" || (object.gender() != "男" && object.gender() != "女")) {
			object.setGender(employee->gender());
		}
		if (object.age() <= 0 || object.age() >= 120) {
			object.setAge(employee->age());
		}
		if (object.workedTime() < 0) {
			object.setWorkedTime(employee->workedTime());
		}
		if (object.salary() < 0 || object.salary() > 1000000000) {
			object.setSalary(employee->salary());
		}
		// 部门
		if ((object.departmentId() >= 100 && object.departmentId() != employee->departmentId())
			|| nullptr == department_dao_->getOne(object.departmentId())) {
			object.setDepartment(employee->departmentId(), "");
		}
		// 角色
		if ((object.roleId() >= 100 && object.roleId() != employee->roleId())
			|| nullptr == department_dao_->getOne(object.roleId())) {
			object.setRole(employee->roleId(), "");
		}
		int count = employee_dao_->update(object);
		Connection::commit();
		return ResultEntity<int>::successResultWidthoutData("成功修改" + to_string(count) + "条数据");
	} catch (const string &e) {
		Connection::rollback();
		return ResultEntity<int>::faildResult(GETLIST_FAILD_PREFIX + e);
	} catch (const exception &e) {
		Connection::rollback();
		return ResultEntity<int>::faildResult(GETLIST_FAILD_PREFIX + e.what());
	}
}
ResultEntity<int> EmployeeService::remove(string id) {
	static const string &REMOVE_FAILD_PREFIX = "删除员工信息失败：";
	try {
		Connection::startTranscation();
		int no = std::stoi(id);
		if (no < 10000) {
			throw string("员工编号无效");
		}
		auto employee = employee_dao_->getOne(no);
		if (employee == nullptr) {
			throw string("没有员工");
		}

		if (employee->departmentId() >= 100) {
			department_dao_->setManagerIdNull(no);
		}
		int count = employee_dao_->remove(no);
		Connection::commit();
		return ResultEntity<int>::successResultWidthoutData("成功删除" + to_string(count) + "条数据");
	} catch (const string &e) {
		Connection::rollback();
		return ResultEntity<int>::faildResult(REMOVE_FAILD_PREFIX + e);
	} catch (const exception &e) {
		Connection::rollback();
		return ResultEntity<int>::faildResult(REMOVE_FAILD_PREFIX + e.what());
	}
}

/**
 * @brief 获得月工资
 * @return
*/
ResultEntity<double> EmployeeService::getMonthSalary(Employee &employee) {
	static const string &REMOVE_FAILD_PREFIX = "获得员工月工资失败：";
	try {
		Connection::startTranscation();
		if (employee.id() < 10000) {
			throw string("员工编号无效");
		}
		if (employee.roleId() < 1000) {
			throw string("职位编号无效");
		}
		double month_salary = role_dao_->getMonthSalary(employee.id(), employee.roleId());
		Connection::commit();
		return ResultEntity<double>::successResultWidthData("获得月工资成功", shared_ptr<double>(new double(month_salary)));
	} catch (const string &e) {
		Connection::rollback();
		return ResultEntity<double>::faildResult(REMOVE_FAILD_PREFIX + e);
	} catch (const exception &e) {
		Connection::rollback();
		return ResultEntity<double>::faildResult(REMOVE_FAILD_PREFIX + e.what());
	}

}

void EmployeeService::fillDepartmentAndRole(shared_ptr<Employee> &employee) {
	int department_id = employee->departmentId();
	if (department_id != 0) {
		employee->setDepartment(department_id, department_dao_->getOne(department_id)->name());
	}
	int role_id = employee->roleId();
	if (role_id != 0) {
		employee->setRole(role_id, role_dao_->getRoleName(role_id));
	}
}

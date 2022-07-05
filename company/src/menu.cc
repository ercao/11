#include "../include/menu.h"
void Menu::stage() {
	cout << "小型公司人员管理系统" << endl;
	cout << "---------------------------------------------------------" << endl;
	system("pause");
	showMenuItems("主菜单", {
		{"员工管理",[this]() { showMenuItems("员工管理", {
			{"添加员工", bind(&Menu::addEmployee, this)},
			{"删除员工", bind(&Menu::removeEmployee, this)},
			{"查找员工", bind(&Menu::getOneEmployee, this)},
			{"修改员工", bind(&Menu::editEmployee, this)},
			{"显示所有员工", bind(&Menu::getListEmployee, this)},
			}); }},
		{"部门管理",[this]() { showMenuItems("部门管理", {
			{"添加部门", bind(&Menu::addDepartment, this)},
			{"删除部门", bind(&Menu::removeDepartment, this)},
			{"查找部门", bind(&Menu::getOneDepartment, this)},
			{"修改部门", bind(&Menu::editDepartment, this)},
			{"显示所有部门", bind(&Menu::getListDepartment, this)},
			}); }},
		{"导出数据",bind(&Menu::exportDataToJson, this)},
		});
}

void Menu::addEmployee() {
	Employee employee;
	cin >> employee;
	auto result = employee_service_->add(employee);
	cout << result.msg_ << endl;
}
void Menu::editEmployee() {
	cout << "请输入员工编号：";
	int id;
	cin >> id;
	auto result = employee_service_->getOne(to_string(id));
	cout << result.msg_ << endl;
	if (!result.result_) {
		return;
	}
	cout << result.data_ << endl;
	Employee employee;
	employee.setId(id);
	cin >> employee;
	auto flag = employee_service_->edit(employee);
	cout << flag.msg_ << endl;
}
void Menu::getOneEmployee() {
	cout << "请输入员工编号：";
	int id;
	cin >> id;
	auto result = employee_service_->getOne(to_string(id));
	cout << result.msg_ << endl;
	if (!result.result_) {
		return;
	}
	cout << result.data_ << endl;
}
void Menu::getListEmployee() {
	auto result = employee_service_->getPageInfo("1", to_string(INT_MAX));
	cout << result.msg_ << endl;
	if (!result.result_) {
		return;
	}
	cout << result.data_ << endl;
}
void Menu::removeEmployee() {
	cout << "请输入员工编号：";
	int id;
	cin >> id;
	cout << employee_service_->remove(to_string(id)).msg_ << endl;
}

void Menu::addDepartment() {
	Department department;
	cin >> department;
	auto result = department_service_->add(department);
	cout << result.msg_ << endl;
}
void Menu::editDepartment() {
	cout << "请输入部门编号：";
	int id;
	cin >> id;
	auto result = department_service_->getOne(to_string(id));
	cout << result.msg_ << endl;
	if (!result.result_) {
		return;
	}
	cout << result.data_ << endl;
	Department department;
	department.setId(id);
	cin >> department;
	auto flag = department_service_->edit(department);
	cout << flag.msg_ << endl;
}
void Menu::getOneDepartment() {
	cout << "请输入部门编号：";
	int id;
	cin >> id;
	auto result = department_service_->getOne(to_string(id));
	cout << result.msg_ << endl;
	if (!result.result_) {
		return;
	}
	cout << result.data_ << endl;
}
void Menu::getListDepartment() {
	auto result = department_service_->getPageInfo("1", to_string(INT_MAX));
	cout << result.msg_ << endl;
	if (!result.result_) {
		return;
	}
	cout << result.data_ << endl;
}
void Menu::removeDepartment() {
	cout << "请输入部门编号：";
	int id;
	cin >> id;
	cout << department_service_->remove(to_string(id)).msg_ << endl;
}

void Menu::exportDataToJson() {
	cout << "请输入要导出的文件路径：";
	string filename;
	cin >> filename;
	cout << system_service_->exportData(filename).msg_ << endl;
}

void Menu::showMenuItems(const string &title, const vector<std::pair<string, function<void(void)>>> &items) {
	while (true) {
		system("cls");
		// 显示菜单
		cout << title << endl;
		int i = 0;
		for (auto item : items) {
			cout << ++i << " " << item.first << endl;
		}
		cout << "- 返回上一页" << endl;
		cout << "0 退出程序" << endl;
		cout << "请输入菜单序号：";
		int select = getMenuSelect(items.size());
		if ('-' == select) {
			break;
		} else if ('0' == select) {
			cout << "是否真的要退出程序？(Y/N)";
			if ('y' == getMenuSelect(items.size()) || 'Y' == getMenuSelect(items.size())) {
				std::exit(EXIT_SUCCESS);
			}
		} else {
			auto callback = items[select - '0' - 1].second;
			if (callback == nullptr) {
				std::cout << "该菜单无效" << endl;
			} else {
				system("cls");
				callback();
			}
		}
		system("pause");
	}
}

char Menu::getMenuSelect(size_t max) {
	while (true) {
		string select;
		getline(cin, select);
		if (select.length() != 1 || (select[0] != '-' && select[0] < '0' && select[0] >= (max + '0'))) {
			cout << "格式输入错误！请重新输入：" << endl;
			continue;
		}
		return select[0];
	}
}

/**
 * @brief 很多检查都没有做
*/
istream &operator >> (istream &is, Employee &employee) {
	while (true) {
		cout << "请输入员工账户：";
		string username;
		cin >> username;
		employee.setUsername(username);
		cout << "请输入员工密码：";
		string password;
		cin >> password;
		employee.setPassword(password);
		cout << "请输入员工名字：";
		string name;
		cin >> name;
		employee.setName(name);
		cout << "请输入员工性别：";
		string gender;
		cin >> gender;
		employee.setGender(gender);
		cout << "请输入员工年龄：";
		int age;
		cin >> age;
		employee.setAge(age);
		cout << "请输入员工基础工资：";
		double salary;
		cin >> salary;
		employee.setSalary(salary);
		// 输出全部部门信息
		DepartmentService department_service;
		auto resutl1 = department_service.getPageInfo("1", to_string(INT_MAX));
		cout << resutl1.data_ << endl;
		// 输入
		cout << "请输入员工部门编号：";
		int department_id;
		cin >> department_id;
		employee.setDepartment(department_id, "");
		// 输出所有角色信息
		RoleService role_service;
		auto resutl2 = role_service.getList("1", to_string(INT_MAX));
		cout << resutl2.data_ << endl;
		cout << "请输入员工角色编号：";
		int role_id;
		cin >> role_id;
		employee.setRole(role_id, "");
		getchar();
		// 输入
		cout << shared_ptr<Employee>(new Employee(employee)) << endl;
		cout << "信息是否正确？（Y/N）";
		string result;
		getline(cin, result);
		if (result.length() == 1 && 'n' == result[0] && 'Y' == result[0]) {
			continue;
		}
		break;
	}
	return is;
}

/**
 * @brief 很多检查都没有做
*/
istream &operator >> (istream &is, Department &department) {
	while (true) {
		cout << "请输入部门名字：";
		string name;
		cin >> name;
		department.setName(name);
		cout << "请输入部门销售额：";
		double sales;
		cin >> sales;
		department.setSale(sales);
		cout << "请输入部门管理者编号(0 表示无管理者)：";
		int manager_id;
		cin >> manager_id;
		department.setManager(manager_id, "");
		getchar();

		// 确认信息
		cout << shared_ptr<Department>(new Department(department)) << endl;
		cout << "信息是否正确？（Y/N）";
		string result;
		getline(cin, result);
		if (result.length() == 1 && ('n' == result[0] || 'N' == result[0])) {
			continue;
		}
		break;
	}
	return is;
}

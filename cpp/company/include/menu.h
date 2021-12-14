#ifndef __MENU_H__
#define __MENU_sH__
#include "service.h"
#include "print.h"

class Menu final {
public:
	void stage();
	void addEmployee();
	void editEmployee();
	void getOneEmployee();
	void getListEmployee();
	void removeEmployee();

	void addDepartment();
	void editDepartment();
	void getOneDepartment();
	void getListDepartment();
	void removeDepartment();
	void exportDataToJson();


public:
	void showMenuItems(const string &title, const vector<std::pair<string, function<void(void)>>> &items);
	char getMenuSelect(size_t max);
private:
	shared_ptr<EmployeeService> employee_service_{ new EmployeeService() };
	shared_ptr<DepartmentService> department_service_{ new DepartmentService() };
	shared_ptr<SystemService> system_service_{ new SystemService() };
	shared_ptr<RoleService> role_service_{ new RoleService() };
};

istream &operator >> (istream &is, Employee &employee);
istream &operator >> (istream &is, Department &department);
#endif // !__MENU_H__

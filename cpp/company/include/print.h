
#ifndef __PRINT_H__
#define __PRINT_H__
#include "entity.h"
#include <iostream>
#include <iomanip>

class Printer final {
public:
	// 项的宽度
	static const int WIDTH = 12;
	static const int DEPARTMENT_WIDTH = (WIDTH + 1) * 4 - 1;
	static const int EMPLOYEE_WIDTH = (WIDTH + 1) * 12 - 1;
	static const int ROLE_WIDTH = (WIDTH + 1) * 2 - 1;
public:
	static ostream &print(const shared_ptr<Department> &d);
	static ostream &print(const shared_ptr<Employee> &e);
	static ostream &print(const shared_ptr<Role> &r);

	static ostream &printStringCenter(int width, string s);
	static ostream &printRepeatX(int width, char ch);
	static ostream &printTitleForDepartment();
	static ostream &printTitleForEmployee();
	static ostream &printTitleForRole();
};

ostream &operator <<(ostream &os, const shared_ptr<PageInfo<Department>> &ds);
ostream &operator <<(ostream &os, const shared_ptr<PageInfo<Employee>> &es);
ostream &operator << (ostream &os, const shared_ptr<PageInfo<Role>> &ds);
ostream &operator <<(ostream &os, const shared_ptr<Department> &d);
ostream &operator <<(ostream &os, const shared_ptr<Employee> &e);
ostream &operator <<(ostream &os, const shared_ptr<Role> &r);
#endif // !__PRINT_H__

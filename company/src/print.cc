#include "../include/print.h"

ostream &Printer::printRepeatX(int width, char ch) {
  cout << "|";
  while (width-- > 0) {
    cout << ch;
  }
  cout << "|";
  return cout;
}

ostream &Printer::printTitleForEmployee() {
  printRepeatX(EMPLOYEE_WIDTH, '-') << endl;
  cout << left << "|" << setw(WIDTH) << "雇员编号"
       << "|" << setw(WIDTH) << "雇员账户"
       << "|" << setw(WIDTH) << "雇员密码"
       << "|" << setw(WIDTH) << "雇员名字"
       << "|" << setw(WIDTH) << "雇员性别"
       << "|" << setw(WIDTH) << "雇员年龄"
       << "|" << setw(WIDTH) << "工作时间"
       << "|" << setw(WIDTH) << "雇员工资"
       << "|" << setw(WIDTH) << "所属部门"
       << "|" << setw(WIDTH) << "雇员职位"
       << "|" << setw(WIDTH) << "创建时间"
       << "|" << setw(WIDTH) << "修改时间"
       << "|" << endl;
  return printRepeatX(EMPLOYEE_WIDTH, '=');
}

ostream &Printer::printStringCenter(int width, string s) {
  size_t length = s.length();
  if (length > width) {
    s = s.substr(0, width);
    length = width;
  }
  cout << "|";
  size_t half = ((width - length) >> 1);
  for (int i = 0; i < half; ++i) {
    cout << ' ';
  }
  cout << s;
  if (((width - length) & 1) != 0) {
    ++half;
  }
  for (int i = 0; i < half; ++i) {
    cout << ' ';
  }
  cout << "|" << endl;
  return printRepeatX(width, '-');
}

ostream &Printer::printTitleForDepartment() {
  printRepeatX(DEPARTMENT_WIDTH, '-') << endl;
  cout << left << "|" << setw(WIDTH) << "部门编号"
       << "|" << setw(WIDTH) << "部门名字"
       << "|" << setw(WIDTH) << "管理者名字"
       << "|" << setw(WIDTH) << "销售额"
       << "|" << endl;
  return printRepeatX(DEPARTMENT_WIDTH, '=');
}

ostream &Printer::printTitleForRole() {
  printRepeatX(ROLE_WIDTH, '-') << endl;
  cout << left << "|" << setw(WIDTH) << "角色编号"
       << "|" << setw(WIDTH) << "角色名字"
       << "|" << endl;
  return printRepeatX(ROLE_WIDTH, '=');
}

ostream &Printer::print(const shared_ptr<Employee> &e) {
  if (e == nullptr) {
    printStringCenter(EMPLOYEE_WIDTH, "null") << endl;
    return cout;
  }
  return cout << left << "|" << setw(WIDTH) << e->id() << "|" << setw(WIDTH)
              << e->username() << "|" << setw(WIDTH) << e->password() << "|"
              << setw(WIDTH) << e->name() << "|" << setw(WIDTH) << e->gender()
              << "|" << setw(WIDTH) << e->age() << "|" << setw(WIDTH)
              << e->workedTime() << "|" << setw(WIDTH) << e->salary() << "|"
              << setw(WIDTH) << e->departmentName() << "|" << setw(WIDTH)
              << e->roleName() << "|" << setw(WIDTH) << e->createTime() << "|"
              << setw(WIDTH) << e->updateTime() << "|";
}

ostream &Printer::print(const shared_ptr<Role> &r) {
  if (r == nullptr) {
    printStringCenter(ROLE_WIDTH, "null") << endl;
    return cout;
  }
  return cout << left << "|" << setw(WIDTH) << r->id() << "|" << setw(WIDTH)
              << r->name() << "|";
}

ostream &Printer::print(const shared_ptr<Department> &d) {
  if (d == nullptr) {
    printStringCenter(DEPARTMENT_WIDTH, "null");
    return cout;
  }
  return cout << left << "|" << setw(WIDTH) << d->id() << "|" << setw(WIDTH)
              << d->name() << "|" << setw(WIDTH) << d->managerName() << "|"
              << setw(WIDTH) << d->sale() << "|";
}

ostream &operator<<(ostream &os, const shared_ptr<PageInfo<Employee>> &es) {
  Printer::printTitleForEmployee() << endl;
  if (es == nullptr) {
    Printer::printStringCenter(Printer::EMPLOYEE_WIDTH, "null");
    return os;
  }
  for (auto e : es->data_) {
    Printer::print(e) << endl;
    Printer::printRepeatX(Printer::EMPLOYEE_WIDTH, '-') << endl;
  }
  return os;
}
ostream &operator<<(ostream &os, const shared_ptr<PageInfo<Department>> &ds) {
  Printer::printTitleForDepartment() << endl;
  if (ds == nullptr) {
    Printer::printStringCenter(Printer::DEPARTMENT_WIDTH, "null");
    return os;
  }
  for (auto d : ds->data_) {
    Printer::print(d) << endl;
    Printer::printRepeatX(Printer::DEPARTMENT_WIDTH, '-') << endl;
  }
  return os;
}

ostream &operator<<(ostream &os, const shared_ptr<PageInfo<Role>> &ds) {
  Printer::printTitleForRole() << endl;
  if (ds == nullptr) {
    Printer::printStringCenter(Printer::ROLE_WIDTH, "null");
    return os;
  }
  for (auto d : ds->data_) {
    Printer::print(d) << endl;
    Printer::printRepeatX(Printer::ROLE_WIDTH, '-') << endl;
  }
  return os;
}

ostream &operator<<(ostream &os, const shared_ptr<Department> &d) {
  Printer::printTitleForDepartment() << endl;
  Printer::print(d) << endl;
  return os;
}
ostream &operator<<(ostream &os, const shared_ptr<Employee> &e) {
  Printer::printTitleForEmployee() << endl;
  Printer::print(e) << endl;
  return os;
}
ostream &operator<<(ostream &os, const shared_ptr<Role> &r) {
  Printer::printTitleForRole() << endl;
  Printer::print(r) << endl;
  return os;
}

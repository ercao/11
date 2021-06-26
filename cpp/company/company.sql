# 创建数据库
drop database if exists company;
create database company;

# 选择数据库
use company;

# 创建数据表
drop table if exists department;
create table if not exists  department (
    `id` integer(3)  primary key auto_increment comment '部门编号',
    `name` varchar(63) unique not null comment '部门名字',
    `manager_id` int(5) null comment '管理者编号',
    `sales` decimal(12, 2) not null default 0 comment '销售额',
    `deleted` boolean not null default 0 comment '删除标志位'
) default collate utf8mb4_unicode_ci comment '部门信息表';

drop table if exists employee;
create table if not exists employee (
    `id` integer(5) primary key auto_increment comment '员工编号',
    `username` varchar(63) unique not null comment '员工账号',
    `password` varchar(63) not null comment '账号密码',
    `name` varchar(63) not null comment '员工姓名',
    `gender` enum('男', '女') not null default '男' comment '员工性别',
    `age` int(3) not null default 0 comment '员工年龄',
    `worked_time` integer(7) not null default 0 comment '距离上次发工资工作的时间',
    `salary` decimal(10, 2) not null default 0 comment '基础工资',
    `department_id` int(3) not null default 100 comment '所属部门编号',
    `role_id` int(4) not null default 1000 comment '职位编号',
    `create_time` datetime not null default now() comment '账号创建时间',
    `update_time` datetime not null default now() comment '账号修改时间',
    `deleted` boolean not null default 0 comment '删除标志位'
) default  collate utf8mb4_unicode_ci comment '员工表';

drop table if exists role;
create table if not exists role (
    `id` integer(4) primary key auto_increment comment '角色编号',
    `name` varchar(63) unique not null comment '角色名字',
    `month_salary` varchar(511) not null comment '月工资计算方法',
    `deleted` boolean not null default 0 comment '删除标志位'
)  default  collate utf8mb4_unicode_ci comment '角色表';

drop table if exists `system`;
create table if not exists `system`(
    `username` varchar(63) primary key comment '管理员账号',
    `password` varchar(63) not null comment '管理员密码',
    `login_time` datetime not null default now() comment '最后一次登录时间'
) default collate utf8mb4_unicode_ci;

# 添加外键约束
alter table department add constraint foreign key (manager_id) references employee(`id`);
alter table employee add constraint  foreign key (`department_id`) references department(`id`);
alter table employee add constraint foreign key (`role_id`) references role(`id`);

# 添加初始化数据
# 系统信息初始数据
insert into `system`(`username`, `password`) value ('admin', '123456');

# 角色初始数据
insert into  `role`(`id`, `name`, `month_salary`) value (1000, '普通员工', 'select `salary` from employee where `id` = :id and deleted<>true');
insert into  `role`(`name`, `month_salary`) value ('技术员', 'select (`worked_time` * `salary`) from employee where `id` = :id and deleted<>true');
insert into  `role`(`name`, `month_salary`) value ('经理', 'select `salary` from employee where `id` = :id and deleted<>true');
insert into  `role`(`name`, `month_salary`) value ('销售员', 'select (`salary` * 1.04) from employee where `id` = :id and deleted<>true');
insert into `role`(`name`, `month_salary`) value ('销售经理', 'select (e.`salary` + d.sales * 0.005) from employee e left join department d on e.department_id = d.id where e.`id` = :id and e.deleted <> true;');

# 部门初始数据
insert into `department`(id, name, manager_id, sales, deleted) values (100, '普通部门', null, 8743, false);

# 员工初始数据
insert into `employee`(id, username, password, name, gender, age, worked_time, salary, department_id, role_id, create_time, update_time, deleted)
values (10000, 'ercao', '123456', '二草','男', 20, 19, 10000, 100, 1000, now(), now(), false);

# 查询员工真实月工资
select (salary * `worked_time`) as month_salary from employee;

select (salary * d.sales * 0.4) as 'month_salary' from employee
    left join department d on employee.department_id = d.id;


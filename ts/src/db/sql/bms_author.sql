create table author
(
    id          int auto_increment comment '作者编号'
        primary key,
    name        varchar(50)                 not null comment '作者名字',
    avatar      varchar(100)                null comment '作者头像：限制100个字符',
    gender      enum ('男', '女', '未知')       not null comment '作者性别',
    description longtext                    null comment '作者描述',
    state       enum ('0', '1') default '0' null comment '作者状态'
)
    comment '作者表';

INSERT INTO bms.author (id, name, avatar, gender, description, state) VALUES (1, '张三', 'https://secure.gravatar.com/avatar/daea3ba91a686b3628e7e7ca08980e39', '男', '一位不知名的', '0');
INSERT INTO bms.author (id, name, avatar, gender, description, state) VALUES (2, '李四', 'https://secure.gravatar.com/avatar/daea3ba91a686b3628e7e7ca08980e39', '未知', '一位不知名的小丑2', '0');
INSERT INTO bms.author (id, name, avatar, gender, description, state) VALUES (7, '你好', 'fa', '女', 'fdfdsafdsa', '0');
INSERT INTO bms.author (id, name, avatar, gender, description, state) VALUES (8, '张三', '000', '男', '张三是狗', '0');
INSERT INTO bms.author (id, name, avatar, gender, description, state) VALUES (9, '你好', 'fdfdsa', '男', 'fdfdsafdsa', '0');
INSERT INTO bms.author (id, name, avatar, gender, description, state) VALUES (10, '张三1', '000', '男', '张三是狗', '0');

create table label
(
    id    int auto_increment comment '标签编号'
        primary key,
    name  varchar(20)                 not null comment '标签名称',
    color varchar(10)                 not null comment '16进制颜色值',
    state enum ('0', '1') default '0' null comment '标签状态',
    constraint lab_name_uindex
        unique (name)
)
    comment '标签表';

INSERT INTO bms.label (id, name, color, state) VALUES (1, '科学技术', '#DC143C', '0');
INSERT INTO bms.label (id, name, color, state) VALUES (2, '儿童读物', '#8A2BE2', '0');
INSERT INTO bms.label (id, name, color, state) VALUES (6, '标签', '#483D8B', '0');
INSERT INTO bms.label (id, name, color, state) VALUES (7, '呵呵呵', '#00FFFF', '0');
INSERT INTO bms.label (id, name, color, state) VALUES (9, '哈哈哈哈', '#DC143C', '0');

create table book
(
    uuid        varchar(36)                  not null comment '图书编号'
        primary key,
    name        varchar(100)                 not null comment '图书名称',
    pictures    longtext collate utf8mb4_bin null comment '图书图片',
    description longtext                     null comment '图书描述',
    authors     longtext collate utf8mb4_bin not null comment '作者编号',
    labels      longtext collate utf8mb4_bin null comment '图书标签',
    publish     date                         not null comment '出版日期',
    state       enum ('0', '1') default '0'  not null comment '图书状态'
)
    comment '图书表';

INSERT INTO bms.book (uuid, name, pictures, description, authors, labels, publish, state) VALUES ('5c174fac-2db0-4319-b8aa-dc298ce82bd1', 'ercao', '[]', 'fdsfadf', '[2, 10, 7, 9]', '[2, 7, 6]', '2022-04-05', '0');
INSERT INTO bms.book (uuid, name, pictures, description, authors, labels, publish, state) VALUES ('6e76a360-65f4-4ea7-a449-7876fa6c1e0a', '你好，我恁爹', '["http://api.dujin.org/bing/1920.php"]', '哈哈哈', '[1]', '[2]', '2022-04-29', '0');
INSERT INTO bms.book (uuid, name, pictures, description, authors, labels, publish, state) VALUES ('e7e8b883-b17d-4aae-81a7-9365537651e0', '母猪的产后护理', '[]', '母猪的产后护理，爵士好书', '[2, 7, 9]', '[1, 2, 9]', '2022-04-01', '0');

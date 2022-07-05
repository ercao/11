drop database if exists music;
create database if not exists music;

use music;

drop table if exists album;
create table if not exists album
(
    `uuid` varchar(36) primary key not null comment '专辑编号',
    `name` longtext not null comment '专辑名称',
    `description` longtext null  comment '专辑描述',
    `artists` json not null  comment '专辑所属音乐人列表',
    `picture_url` varchar(100) null comment '专辑图片url',
    `publish_time` date not null comment '专辑发行时间',
    `create_time` datetime null  default now() comment '专辑创建时间',
    `status` enum('0', '1') default '0' comment '专辑状态 0(正常) 1(异常)'

    # TODO foreign key artists
    ) comment '专辑表';

drop table if exists artist;
create table if not exists artist
(
    `uuid` varchar(36) primary key comment  '歌手编号',
    `name` varchar(100) not null comment '歌手名字',
    `description` longtext  null  comment '歌手描述',
    `picture_url` varchar(100) null comment '歌手图片url',
    `user` varchar(36) null comment  '歌手用户编号',
    `type` enum('0', '1', '2', '3' ) not null default '0' comment '歌手类型 0(全部) 1(男歌手) 2(女歌手) 3(乐队)',
    `area` enum('0', '7', '76', '8', '16', '-1') not null default '0' comment '歌手地区 0(全部) 7(华语) 96(欧美) 8(日本) 16(韩国) -1(其他)',
    `status` enum('0', '1') default '0' comment '专辑状态 0(正常) 1(异常)'
    ) comment '歌手表';

drop table if exists playlist;
create table if not exists playlist
(
    `uuid` varchar(36) primary key not null comment '歌单编号',
    `name` longtext not null comment '歌单名字',
    `picture_url` varchar(100) null comment '歌单图片',
    `description` longtext null  comment '歌单描述',
    `user` varchar(36) not null comment '歌单所属用户',
    `songs` json not null  comment '歌单歌曲列表',
    `tags` json not null  comment '歌单标签列表',
    `update_time` datetime not null default now() comment '歌单更新时间',
    `create_time` datetime not null default now()comment '歌单创建时间'
    # TODO foreign key tags / songs
    ) comment '歌单表';


drop table if exists playlist_tag;
create table if not exists playlist_tag
(
    `name` varchar(20) primary key not null comment '歌单标签名字'
    ) comment '歌单标签表';

drop table if exists song;
create table  if not exists song
(
    `uuid` varchar(36) primary key not null comment '歌曲编号',
    `name` varchar(200) not null comment '歌曲名字',
    `picture_url` varchar(100) null comment '歌曲图片url',
    `artists` json not null  comment '歌曲所属歌手',
    `album` varchar(36) null comment '歌曲所属专辑',
    `url` varchar(100) not null comment '歌曲url',
    `status` enum('0', '1') default '0' comment '歌曲状态 0(正常) 1(异常)'
    # TODO foreign key artists
    ) comment '歌曲表';

drop table if exists user;
create table if not exists user
(
    `uuid` varchar(36) primary key not null comment '用户编号',
    `username` varchar(20) unique not null comment '用户名',
    `password` varchar(16) not null comment '用户密码',
    `nickname` varchar(100) not null default '' comment  '用户昵称',
    `avatar_url` varchar(100) null comment '用户头像url',
    `login_time` datetime not null default now() comment '用户上次登陆时间',
    `role` enum('0', '99') not null default '0' comment '用户角色 0(普通用户) 1(管理员)',
    `status` enum('0', '1') default '0' comment '歌曲状态 0(正常) 1(异常)'
    ) comment '用户表';

drop table if exists lyric;
create table if not exists lyric
(
    `song` varchar(36) primary key not null comment '歌曲编号',
    `content` longtext not null  comment '歌词内容'
    ) comment '歌词表';

drop table if exists jwt;
create table if not exists jwt
(
    `token` varchar(500) primary key not null comment 'jwt token',
    `expire_time` timestamp not null comment 'jwt过期时间'
) comment 'jwt表';

alter table artist add constraint foreign key (user) references user(uuid);
alter table playlist add constraint foreign key (user) references user(uuid);
alter table lyric add constraint foreign key (song) references  song(uuid);

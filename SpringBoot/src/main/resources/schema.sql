drop table if exists question;

create table if not exists question
(
    id          bigint auto_increment
    primary key,
    a           varchar(255) null,
    b           varchar(255) null,
    c           varchar(255) null,
    d           varchar(255) null,
    answer      varchar(255) null,
    description varchar(255) null
    );
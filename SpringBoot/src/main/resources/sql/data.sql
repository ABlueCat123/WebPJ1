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
INSERT IGNORE INTO question (a, b, c, d, answer, description) VALUES ('1', '2', '3', '4', 'B', '1+1');
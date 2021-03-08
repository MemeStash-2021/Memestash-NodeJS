create database if not exists memestash;

use memestash;
set FOREIGN_KEY_CHECKS = 0;
drop table if exists users;
drop table if exists collections;
drop table if exists cards;
drop table if exists trades;
drop table if exists offers;
set FOREIGN_KEY_CHECKS = 1;

create table cards(
    id int auto_increment primary key,
    name tinytext unique,
    picture text,
    price int,
    description text
);

create table users(
    id int auto_increment primary key unique,
    username tinytext unique,
    password text,
    wallet int
);

create table collections(
    user_id int,
    card_id int,
    foreign key (user_id) references users(id),
    foreign key (card_id) references cards(id)
);

create table trades(
    id int auto_increment primary key unique,
    sender_id int,
    receiver_id int,
    foreign key (sender_id) references users(id),
    foreign key (receiver_id) references users(id)
);

create table offers(
    trade_id int,
    card_id int,
    participant ENUM('sender', 'receiver'),
    foreign key (trade_id) references trade(id),
    foreign key (card_id) references cards(id)
);

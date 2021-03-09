create database if not exists memestash;

use memestash;
set FOREIGN_KEY_CHECKS = 0;
drop table if exists users;
drop table if exists collections;
drop table if exists cards;
drop table if exists trades;
drop table if exists offers;
drop table if exists chats;
drop table if exists messages;
set FOREIGN_KEY_CHECKS = 1;

create or replace user node_provider identified by 'N0desslyExpress1ve';
grant all privileges on memestash to 'node_provider';

create table cards(
    id int auto_increment primary key,
    name varchar(60) unique,
    picture varchar(255),
    price int,
    description text
);

create table users(
    id int auto_increment primary key unique,
    username varchar(60) unique,
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
    foreign key (trade_id) references trades(id),
    foreign key (card_id) references cards(id)
);

create table chats(
    id int auto_increment primary key unique,
    participant_id_1 int,
    participant_id_2 int,
    foreign key (participant_id_1) references users(id),
    foreign key (participant_id_2) references users(id)
);

create table messages(
    chat_id int,
    message varchar(255),
    timestamp datetime,
    foreign key (chat_id) references chats(id)
);

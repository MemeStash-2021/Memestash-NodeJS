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
grant all privileges on memestash.* to 'node_provider';

create table cards
(
    id          int auto_increment primary key,
    name        varchar(60) unique not null,
    picture     text               null,
    price       int                not null,
    description text               not null,
    views       int                not null,
    likes       int                not null
);

create table users
(
    id       int auto_increment primary key unique,
    username varchar(60) unique  not null,
    email    varchar(255) unique not null,
    password text                not null,
    wallet   int                 not null
);

create table collections
(
    user_id int not null,
    card_id int not null,
    foreign key (user_id) references users (id),
    foreign key (card_id) references cards (id)
);

create table trades
(
    id          int auto_increment primary key unique,
    sender_id   int not null,
    receiver_id int not null,
    foreign key (sender_id) references users (id),
    foreign key (receiver_id) references users (id)
);

create table offers
(
    trade_id       int not null,
    card_id        int not null,
    participant_id int not null,
    foreign key (trade_id) references trades (id),
    foreign key (card_id) references cards (id),
    foreign key (participant_id) references users (id)
);

create table chats
(
    id               int auto_increment primary key unique,
    participant_id_1 int not null,
    participant_id_2 int not null,
    foreign key (participant_id_1) references users (id),
    foreign key (participant_id_2) references users (id)
);

create table messages
(
    chat_id   int          not null,
    message   varchar(255) not null,
    timestamp datetime     not null,
    foreign key (chat_id) references chats (id)
);

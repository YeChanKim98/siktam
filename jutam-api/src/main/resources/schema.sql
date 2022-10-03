-- 유저
create table if not exists user(
    seq int auto_increment,
    id varchar(25) not null,
    password varchar(25) not null,
    name varchar(15) not null,
    nickname varchar(15) not null,
    email varchar(30) not null,
    phone varchar(15),
    age varchar(10) not null
);

-- 음식점
create table if not exists place(
    id varchar(15) primary key not null, -- 가게 고유 번호
    category varchar(5) not null, -- 가게 분류 (카페, 중국집, 한식집)
    img varchar(255),
    name varchar(25) not null, --가게 이름
    address varchar(50) not null, -- 가게 주소
    tel varchar(15), -- 가게 전화번호
    lat decimal(20, 16) not null, -- 위도
    lng decimal(20, 16) not null -- 경도
    );

-- 메뉴
create table if not exists menu(
    id varchar(15) not null, -- 가게 고유 번호
    place_category varchar(5) not null,
    category varchar(25) not null, -- 음식 분류 (단품, 세트)
    name varchar(30) not null, -- 음식이름
    price int not null, -- 메뉴 가격
    foreign key (id) references place(id),
    primary key(id, name)
    );


-- 현재 사용 X

-- -- 한줄리뷰
-- create table if not exists simple_review(
--     review_id int primary key auto_increment,
--     place_id int not null,
--     user_id varchar(25) not null,
--     recmnd varchar(5) not null,
--     content varchar(55) not null,
--     review_date timestamp default current_timestamp
-- );
--


-- -- 예약
-- create table if not exists reserve(
--     rsrv_seq int primary key auto_increment,
--     rsrv_pla int not null,
--     req_user varchar(25) not null,
--     req_tel varchar(15) not null,
--     rsrv_cnt int not null,
--     rsrv_time datetime not null,
--     req_time timestamp default current_timestamp,
--     rsrv_pms varchar(6) not null default 'wait'
--     );

-- -- 리뷰
-- create table review(
--     review_id int primary key auto_increment,
--     user_id varchar(25) not null,
--     place_id varchar(25) not null,
--     rate int not null,
--     content varchar(255) not null,
--     review_date timestamp default current_timestamp
-- );

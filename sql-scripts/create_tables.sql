create table customers(
    id int generated always as identity primary key,
    name varchar(255) not null,
    phone varchar(50),
    email varchar(50),
    address varchar(255)
);

create table products(
    id int generated always as identity primary key,
    name varchar(255) not null,
    description text
);

create table prices(
    id int generated always as identity primary key,
    prod_id int references products(id) on delete cascade,
    purchase float default 0,
    sale float default 0
);

create table suppliers(
    id int generated always as identity primary key,
    name varchar(255) not null,
    phone varchar(50),
    email varchar(50),
    address varchar(255)
);

create table inventories(
    id int generated always as identity primary key,
    prod_id int references products(id) on delete cascade not null,
    description text,
    quantity int not null default 0,
    date date not null default current_date,
    sup_id int references suppliers(id) on delete cascade not null
);
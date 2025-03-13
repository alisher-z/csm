-- Active: 1741849904817@@127.0.0.1@5432@csm
create table suppliers(
    id int generated always as identity primary key,
    name varchar(100) not null,
    phone varchar(15),
    email varchar(50),
    address text
);

create table customers(
    id int generated always as identity primary key,
    name varchar(100) not null,
    phone varchar(15),
    email varchar(50),
    address text
);

create table products(
    id int generated always as identity primary key,
    name varchar(250) not null,
    description text
);

create table inventories(
    id int generated always as identity primary key,
    date date default current_date,
    description text,
    quantity int not null default 0,
    prod_id int references products(id) on delete cascade,
    sup_id int references suppliers(id) on delete cascade
);

create table prices(
    inv_id int not null references inventories(id) on delete cascade,
    prod_id int not null references products(id) on delete cascade,
    purchase float not null default 0,
    sale float not null default 0,
    current boolean not null default false,
    primary key (inv_id, prod_id)
);

create table sales(
    id int generated always as identity primary key,
    date date not null default current_date,
    description text,
    quantity int not null default 0,
    other_price float not null default 0,
    inv_id int not null,
    prod_id int not null,
    cust_id int not null references customers(id) on delete cascade,
    foreign key (inv_id, prod_id) references prices(inv_id, prod_id)
);

create table receivables(
    id int generated always as identity primary key,
    received float not null default 0,
    date date not null default current_date,
    cust_id int references customers(id) on delete cascade
)
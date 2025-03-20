create table sales_receipts(
    id int generated always as identity primary key,
    "name" varchar(50),
    cust_id int not null references customers(id) on delete cascade
);

create table receivables(
    id int generated always as identity primary key,
    "date" date not null,
    received float not null default 0,
    "description" text,
    recp_id int references sales_receipts(id) on delete cascade
);

create table sales(
    id int generated always as identity primary key,
    "description" text,
    quantity int not null default 0,
    other_price float not null default 0,
    inv_id int not null,
    prod_id int not null,
    foreign key (inv_id, prod_id) references prices(inv_id, prod_id)
);

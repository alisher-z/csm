create table sales_receipt(
    id int generated always as identity primary key,
    "name" varchar(50),
    "date" date not null,
    customer int not null references customers(id) on delete cascade
)

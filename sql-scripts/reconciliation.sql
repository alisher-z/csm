create table reconciliations(
    id int generated always as identity primary key,
    date date,
    name varchar(50),
    description text
);

create procedure pr_insert_reconciliation()
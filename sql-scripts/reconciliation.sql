create table reconciliations(
    id int generated always as identity primary key,
    date date,
    name varchar(50),
    description text
);

drop function fn_list_reconciliation;
create function fn_list_reconciliation()
returns
    table(id int, date date, name varchar)
language plpgsql as $$
    begin
        return query
        select
            reconciliations.id,
            reconciliations.date,
            reconciliations.name
        from reconciliations;
    end;
$$;

create function fn_one_reconciliation(_id int)
returns
    table()
language plpgsql as $$
    begin
        select
    end;
$$;

create procedure pr_insert_reconciliation()


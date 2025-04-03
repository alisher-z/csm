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

create procedure pr_insert_reconciliation();

drop function fn_list_uncleared_reconciliation;
create function fn_list_uncleared_reconciliation(search jsonb default null)
returns table(
    id int,
    date date,
    name varchar,
    description text,
    amounts jsonb
) language plpgsql as $$
    declare
        _cust_id int;

    begin
        if search is not null then
            _cust_id := (search->>'customer')::int;
        end if;

        return query
            with total_sales_cte as(
                select
                    recp_id,
                    sum(quantity * price) as price,
                    (select sum(amount) as received from receivables where recp_id = sales.recp_id) as received
                from sales
                group by recp_id
            )
            select
                sr.id,
                sr.date,
                sr.name,
                sr.description,
                jsonb_build_object(
                    'total', tsc.price,
                    'gift', sr.gift,
                    'received', tsc.received,
                    'due', (tsc.price - sr.gift - tsc.received)
                ) as amounts
            from sales_receipts as sr
            join total_sales_cte as tsc on tsc.recp_id = sr.id
            where (tsc.price - sr.gift - tsc.received) > 0 
                and (search is null or _cust_id = -1 or sr.cust_id = _cust_id);
    end;
$$;
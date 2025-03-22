create receivables (
    id int generated always as identity primary key,
    recn_id int references reconciliations (id) on delete cascade on update cascade,
    recp_id int references sales_receipts (id) on delete cascade on update cascade,
    amount float not null default 0
);



























































































drop table receivables;
create table receivables (
    id int generated always as identity primary key,
    "date" date not null,
    received float not null default 0,
    "description" text,
    recp_id int references sales_receipts (id) on delete cascade
);

drop procedure pr_insert_receivable;
create procedure pr_insert_receivable(receipt jsonb) language plpgsql as $$
    begin
        insert into receivables("date", received, "description", recp_id)
        values(
            (receipt->>'date')::date,
            coalesce(nullif(trim(receipt->>'received'),''),'0')::float,
            nullif(trim(receipt->>'description'),''),
            (receipt->'references'->>'receipt')::integer
        );
    end;
$$;

drop procedure pr_update_receivable;
create procedure pr_update_receivable(receipt jsonb) language plpgsql as $$
    begin
        update receivables set
            "date" = (receipt->>'date')::date, 
            received = coalesce(nullif(trim(receipt->>'received'),''),'0')::float, 
            "description" = nullif(trim(receipt->>'description'),'') 
        where recp_id = (receipt->'references'->>'receipt')::integer;
    end;
$$;

drop procedure pr_delete_receivable;
create procedure pr_delete_receivable(_id int) language plpgsql as $$
    begin
        delete from receivables where id = _id;
    end;
$$;




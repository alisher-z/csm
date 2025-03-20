create table receivables(
    id int generated always as identity primary key,
    "date" date not null,
    received float not null default 0,
    "description" text,
    recp_id int references sales_receipts(id) on delete cascade
);

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

create procedure pr_update_receivable(receipt jsonb) language plpgsql as $$
    begin
        update receivables set
            "date" = (receipt->>'date')::date, 
            received = coalesce(nullif(trim(receipt->>'received'),''),'0')::float, 
            "description" = nullif(trim(receipt->>'description'),'') 
        where recp_id = (receipt->'references'->>'receipt')::integer;
    end;
$$;
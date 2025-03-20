create table sales(
    id int generated always as identity primary key,
    "description" text,
    quantity int not null default 0,
    other_price float not null default 0,
    recp_id int not null references sales_receipts(id) on delete cascade,
    inv_id int not null,
    prod_id int not null,
    foreign key (inv_id, prod_id) references prices(inv_id, prod_id)
);

create procedure pr_insert_sale(receipt jsonb) language plpgsql as $$
    declare
        items jsonb;
        receipt_id int;
        item jsonb;

    begin
        items := receipt->'items';
        receipt_id := (receipt->'references'->>'receipt')::integer;

        for item in select * from jsonb_array_elements(items)
        loop
            insert into sales(description, quantity, other_price, inv_id, prod_id, recp_id)
            values(
                nullif(trim(item->>'description'), ''),
                coalesce(nullif(trim(item->>'quantity'),''),'0')::integer,
                coalesce(nullif(trim(item->>'otherPrice'),''),'0')::float,
                (item->'references'->>'inventory')::integer,
                (item->'references'->>'product')::integer,
                receipt_id
            );
        end loop;
    end;
$$;

create procedure pr_update_sale(receipt jsonb) language plpgsql as $$
    declare
        items jsonb;
        item jsonb;
        receipt_id int;

    begin
        items := receipt->'items';
        receipt_id := (receipt->'references'->>'receipt')::int;

        for item in select * from jsonb_array_elements(items)
        loop
            update sales set
                description = nullif(trim(item->>'description'), ''), 
                quantity = coalesce(nullif(trim(item->>'quantity'),''),'0')::integer, 
                other_price = coalesce(nullif(trim(item->>'otherPrice'),''),'0')::float, 
                inv_id = (item->'references'->>'inventory')::integer, 
                prod_id = (item->'references'->>'product')::integer, 
                recp_id = receipt_id
            where id = (item->>'id')::int;
        end loop;
    end;
$$;
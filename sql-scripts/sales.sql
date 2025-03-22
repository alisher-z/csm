drop table sales;
create table sales(
    id int generated always as identity primary key,
    description text,
    quantity int not null default 0,
    price float not null default 0,
    recp_id int not null references sales_receipts(id) on delete cascade on update cascade,
    prod_id int not null references products(id) on delete restrict on update cascade
);

drop procedure pr_insert_sale;
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
            insert into sales(description, quantity, price, prod_id, recp_id)
            values(
                nullif(trim(item->>'description'), ''),
                coalesce(nullif(trim(item->>'quantity'),''),'0')::integer,
                coalesce(nullif(trim(item->>'price'),''),'0')::float,
                (item->'references'->>'product')::integer,
                receipt_id
            );
        end loop;
    end;
$$;

create procedure pr_update_sale(receipt jsonb) language plpgsql as $$
    declare 
        item jsonb;

    begin
        for item in select * from jsonb_array_elements(receipt->'items')
        loop
            update sales set
            description = nullif(trim(item->>'description'), ''),
            quantity = coalesce(nullif(trim(item->>'quantity'),''),'0')::integer,
            price = coalesce(nullif(trim(item->>'quantity'),''),'0')::integer,
            prod_id = (item->'references'->>'product')::integer
            where id = (item->>'id')::int;
        end loop;
    end;
$$;


























































































drop procedure pr_update_sale;
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

drop procedure pr_delete_sale;
create procedure pr_delete_sale(_id int) language plpgsql as $$
    begin
        delete from sales where id = _id;
    end;
$$;

call pr_delete_sale(1);
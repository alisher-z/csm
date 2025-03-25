-- Active: 1742374391022@@127.0.0.1@5432@csm
drop table sales_receipts;

create table sales_receipts (
    id int generated always as identity primary key,
    cust_id int not null references customers (id) on delete restrict on update cascade,
    date date,
    name varchar(50),
    description text,
    gift float not null default 0
);

drop procedure pr_insert_sales_receipt;
create procedure pr_insert_sales_receipt(receipt jsonb) language plpgsql as $$
    declare
          receipt_id int;
          reconciliation_id int;
        updated_receipt jsonb;

    begin
        insert into sales_receipts(cust_id, date, name, description, gift)
        values(
          (receipt->'references'->>'customer')::int,
          (receipt->>'date')::date,
          nullif(trim(receipt->>'name'),''),
          nullif(trim(receipt->>'description'),''),
          coalesce(nullif(trim(receipt->>'gift'),''),'0')::float
        ) returning id into receipt_id;

        call pr_insert_sale(
          jsonb_set(
               receipt,
               '{references, receipt}',
               to_jsonb(receipt_id),
               true
          )
        );

        insert into reconciliations(date, name, description)
        values(
          (receipt->>'date')::date,
          nullif(trim(receipt->>'name'),''),
          nullif(trim(receipt->>'description'),'')
        ) returning id into reconciliation_id;

        insert into receivables(recn_id, recp_id, amount, is_receipt)
        values(
          reconciliation_id,
          receipt_id,
          coalesce(nullif(trim(receipt->>'received'),''),'0')::float,
          1
        );
    end;
$$;

drop function fn_list_sales_receipt;
create function fn_list_sales_receipt()
returns table(id int, cust_id int, date date, description text, gift float)
language plpgsql as $$
     begin
          return query
               select s.id, s.cust_id, s.date, s.description, s.gift
               from sales_receipts as s;
     end;
$$;

select * from fn_list_sales_receipt();

-- create function fn_list_sales_receipt() 
-- returns table( id int, customer varchar, sales jsonb ) 
-- language plpgsql as $$
--      begin
--           return query
--           select
--                sr.id,
--                c.name,
--                jsonb_agg(
--                     jsonb_build_object(
--                          'id',s.id,
--                          'description', s.description,
--                          'quantity', s.quantity,
--                          'prices', jsonb_build_object(
--                          'otherPrice', s.other_price,
--                          'purchase', p.purchase,
--                          'sale', p.sale
--                          ),
--                          'product', jsonb_build_object(
--                               'id', pr.id,
--                               'name', pr.name
--                          ),
--                          'inv_id', s.inv_id
--                     )
--                ) as sales
--           from sales_receipts as sr
--           join sales as s on s.recp_id = sr.id
--           join customers as c on c.id = sr.cust_id
--           join prices as p on p.inv_id = s.inv_id and p.prod_id = s.prod_id
--           join products as pr on pr.id = s.prod_id
--           group by sr.id, c.name;
--      end;
-- $$;

create procedure pr_update_sales_receipt(receipt jsonb) language plpgsql as $$
     begin
          update sales_receipts set
          cust_id = (receipt->'references'->>'customer')::int,
          date = (receipt->>'date')::date,
          name = nullif(trim(receipt->>'name'),''),
          description = nullif(trim(receipt->>'description'),''),
          gift = coalesce(nullif(trim(receipt->>'gift'),''),'0')::float
          where id = (receipt->>'id')::int;

          call pr_update_sale(receipt);


     end;
$$;

drop procedure pr_update_sales_receipt;

drop procedure pr_delete_sales_receipt;

drop function fn_list_sales_receipt;

drop function fn_one_sales_receipt;

create procedure pr_update_sales_receipt(receipt jsonb)language plpgsql as $$
    declare
        _id int;
        _cust_id int;
        updated_receipt jsonb;

    begin
        _id := (receipt->>'id')::int;
        _cust_id := (receipt->'references'->>'customer')::int;

        update sales_receipts
        set cust_id = _cust_id
        where id = _id;

        updated_receipt := jsonb_set(receipt, '{references, receipt}', to_jsonb(_id), true);

        call pr_update_sale(updated_receipt);
        call pr_update_receivable(updated_receipt);
    end;
$$;

create procedure pr_delete_sales_receipt(_id int) language plpgsql as $$
     begin
          delete from sales_receipts where id = _id;
     end;
$$;

create function fn_one_sales_receipt(_id int) returns table( id int, customer varchar, sales jsonb ) language plpgsql as $$
     begin
          return query
          select
               sr.id,
               c.name,
               jsonb_agg(
                    jsonb_build_object(
                         'id',s.id,
                         'description', s.description,
                         'quantity', s.quantity,
                         'prices', jsonb_build_object(
                         'otherPrice', s.other_price,
                         'purchase', p.purchase,
                         'sale', p.sale
                         ),
                         'product', jsonb_build_object(
                              'id', pr.id,
                              'name', pr.name
                         ),
                         'inv_id', s.inv_id
                    )
               ) as sales
          from sales_receipts as sr
          join sales as s on s.recp_id = sr.id
          join customers as c on c.id = sr.cust_id
          join prices as p on p.inv_id = s.inv_id and p.prod_id = s.prod_id
          join products as pr on pr.id = s.prod_id
          where sr.id = _id
          group by sr.id, c.name;
     end;
$$;

select * from fn_list_sales_receipt ();

select *
from
    sales_receipts as sr
    join sales as s on s.recp_id = sr.id
    join customers as c on c.id = sr.cust_id
    join prices as p on p.inv_id = s.inv_id
    and p.prod_id = s.prod_id
    join products as pr on pr.id = s.prod_id;

call pr_insert_sales_receipt (
    '{
     "date": "2025-03-20",
     "received": 200,
     "description": "my description",
     "references": {
          "customer": 2
     },
     "items": [
          {
               "description": "item1 description",
               "quantity": 3,
               "otherPrice": 0,
               "references": {
                    "inventory": 1,
                    "product": 1
               }
          },
          {
               "description": "item2 description",
               "quantity": 4,
               "otherPrice": 5,
               "references": {
                    "inventory": 1,
                    "product": 1
               }
          }
     ]
}'
);

call pr_insert_sales_receipt (
    '{
     "date": "2025-03-21",
     "received": 0,
     "description": "my description 2",
     "references": {
          "customer": 2
     },
     "items": [
          {
               "description": "item1 description 2",
               "quantity": 5,
               "otherPrice": 0,
               "references": {
                    "inventory": 1,
                    "product": 1
               }
          },
          {
               "description": "item2 description 2",
               "quantity": 4,
               "otherPrice": 5,
               "references": {
                    "inventory": 1,
                    "product": 1
               }
          }
     ]
}'
);

call pr_update_sales_receipt (
    '{
     "id": 1,
     "date": "2025-03-21",
     "received": 200,
     "description": "my description",
     "references": {
          "customer": 2
     },
     "items": [
          {
                "id":1,
               "description": "item1 description",
               "quantity": 5,
               "otherPrice": 0,
               "references": {
                    "inventory": 1,
                    "product": 1
               }
          },
          {
                "id":2,
               "description": "item2 description",
               "quantity": 7,
               "otherPrice": 5,
               "references": {
                    "inventory": 1,
                    "product": 1
               }
          }
     ]
}'
);

select * from sales_receipts;

select * from receivables;

select * from sales;

call pr_insert_receivable (
    '{
     "date": "2025-03-22",
     "received": 250,
     "description": "my description1"  
}'
)
call pr_delete_sales_receipt (1);

delete from receivables where id = 5;
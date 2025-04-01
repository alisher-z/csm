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

drop procedure pr_update_sales_receipt;
create procedure pr_update_sales_receipt(receipt jsonb) language plpgsql as $$
     declare
          receipt_id int;
          reconciliation_id int;

     begin
          receipt_id = (receipt->>'id')::int;
          select recn_id 
          into reconciliation_id
          from receivables 
          where recp_id = receipt_id and is_receipt = 1;

          update sales_receipts set
          cust_id = (receipt->'references'->>'customer')::int,
          date = (receipt->>'date')::date,
          name = nullif(trim(receipt->>'name'),''),
          description = nullif(trim(receipt->>'description'),''),
          gift = coalesce(nullif(trim(receipt->>'gift'),''),'0')::float
          where id = receipt_id;

          call pr_update_sale(receipt);

          update reconciliations set
          date = (receipt->>'date')::date,
          description = nullif(trim(receipt->>'description'),'')
          where id = reconciliation_id;

          update receivables set amount = coalesce(nullif(trim(receipt->>'received'),''),'0')::float
          where recp_id = receipt_id and recn_id = reconciliation_id;
     end;
$$;

drop procedure pr_delete_sales_receipt;
create procedure pr_delete_sales_receipt(_id int) language plpgsql as $$
     begin
          delete from sales_receipts where id = _id;
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

drop function fn_one_sales_receipt;
create function fn_one_sales_receipt(_id int) 
returns 
table( 
     id int,
     date date,
     name varchar,
     description text,
     amounts jsonb,
     customer jsonb,
     sales jsonb 
     ) language plpgsql as $$
     begin
          return query
               with sales_cte as(
               select 
                    s.id,
                    s.recp_id,
                    s.description,
                    s.quantity,
                    s.price,
                    (s.quantity * s.price) as total_price,
                    p.id as product_id,
                    p.name as product_name
               from sales as s
               join products as p on s.prod_id = p.id
               ),
               sum_sales_cte as(
               select
                    sc.recp_id as receipt_id,
                    sum(total_price) as grand_total,
                    (select sr.gift from sales_receipts as sr where sr.id = sc.recp_id) as gift,
                    (select r.amount from receivables as r where r.recp_id = sc.recp_id and is_receipt = 1) as received
               from sales_cte as sc
               group by receipt_id
               ),
               sales_balance_cte as(
               select
                    ssc.receipt_id,
                    ssc.grand_total,
                    ssc.gift,
                    ssc.received,
                    (ssc.grand_total - ssc.gift - ssc.received) as due
               from sum_sales_cte as ssc
               )
               select
               sr.id,
               sr.date,
               sr.name,
               sr.description,
               jsonb_build_object(
                    'total', sbc.grand_total,
                    'gift', sbc.gift,
                    'received', sbc.received,
                    'due', sbc.due
               ) as amounts,
               jsonb_build_object(
                    'id', c.id,
                    'name', c.name
               ) as customer,
               jsonb_agg(
                    jsonb_build_object(
                         'id', sc.id,
                         'description', sc.description,
                         'amounts', jsonb_build_object(
                              'quantity', sc.quantity,
                              'price', sc.price,
                              'total', sc.total_price
                         ),
                         'product', jsonb_build_object(
                              'id', sc.product_id,
                              'name', sc.product_name
                         )
                    )
               ) as sales
               from sales_receipts as sr
               join sales_cte as sc on sc.recp_id = sr.id
               join sales_balance_cte as sbc on sbc.receipt_id = sr.id
               join customers as c on c.id = sr.cust_id
               where sr.id = _id
               group by sr.id, sr.date, sr.name, sr.description, sbc.grand_total, sbc.gift, sbc.received, sbc.due, c.id, c.name;
     end;
$$;
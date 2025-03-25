create view vw_products as
with
    inventory as (
        select prod_id, sum(quantity) as stock
        from inventories
        group by
            prod_id
    ),
    sale as (
        select prod_id, sum(quantity) as sold
        from sales
        group by
            prod_id
    )
select
    p.id,
    p.name,
    p.description,
    coalesce(i.stock, 0) as stocked,
    coalesce(s.sold, 0) as sold,
    coalesce(i.stock, 0) - coalesce(s.sold, 0) as in_stock,
        (
        select sale
        from prices
        where
            prod_id = p.id
            and "current" = true
    ) as unit_price,
    (
        select sale
        from prices
        where
            prod_id = p.id
            and "current" = true
    ) * (
        coalesce(i.stock, 0) - coalesce(s.sold, 0)
    ) as total_price
from
    products as p
    left join inventory as i on i.prod_id = p.id
    left join sale as s on s.prod_id = p.id
order by p.id;

-- select * from vw_products;

create function fn_get_products () returns table (
    id int,
    name varchar,
    description text,
    quantity jsonb,
    price jsonb
) language plpgsql
as $$
    begin
        return query
        select 
            vw_products.id,
            vw_products.name,
            vw_products.description,
            jsonb_build_object(
                'in',stocked,
                'out', sold,
                'left',in_stock
            ) as quantity,
            jsonb_build_object(
                'unit',unit_price,
                'total',total_price
            )
        from vw_products;
    end;
$$;

select * from fn_get_products();

select * from sales;
select
    c.id,
    c.name,
    sum(s.quantity)
from customers as c
join sales as s on s.cust_id = c.id;

select
    s.cust_id,
    s.prod_id,
    s.quantity,
    pr.sale
from sales as s
join prices as pr
on pr.inv_id = s.inv_id and pr.prod_id = s.prod_id;

create function fn_list_customer()
returns table(
    id int,
    name varchar,
    phone varchar,
    email varchar
) language plpgsql
as $$
    begin
        return query
        select c.id, c.name, c.phone, c.email
        from customers as c;
    end;
$$;

SELECT * from fn_list_customer()

create Function fn_one_customer(_id int)
returns table(
    id int,
    "name" varchar,
    phone varchar,
    email varchar,
    address text
) language plpgsql
as $$
    begin
        return query
        select * from customers where customers.id = _id;
    end;
$$;

SELECT * from fn_one_customer(1);

create function fn_list_supplier()
returns table(
    id int,
    name varchar,
    phone varchar,
    email varchar
) language plpgsql
as $$
    begin
        return query
        select s.id, s.name, s.phone, s.email
        from suppliers as s;
    end;
$$;

SELECT * from fn_list_customer()

create Function fn_one_supplier(_id int)
returns table(
    id int,
    "name" varchar,
    phone varchar,
    email varchar,
    address text
) language plpgsql
as $$
    begin
        return query
        select * from suppliers where suppliers.id = _id;
    end;
$$;

drop function fn_list_product;
create function fn_list_product()
returns table(
    id int,
    name varchar,
    description text,
    quantity int,
    purchase float,
    sale float
) language plpgsql
as $$
    begin
        return query
            with _inventories as (
                select _i.prod_id, sum(_i.quantity)::int as quantity from inventories as _i group by _i.prod_id
                )
            select 
                p.id, 
                p.name, 
                p.description, 
                i.quantity, 
                pr.purchase, 
                pr.sale
            from products as p
            join _inventories as i on i.prod_id = p.id
            join prices as pr on pr.prod_id = p.id
            where pr.current = true
            order by id;
    end;
$$;

create Function fn_one_product(_id int)
returns table(
    id int,
    name varchar,
    description text
) language plpgsql
as $$
    begin
        return query
        select * from products where products.id = _id;
    end;
$$;

create function fn_list_inventory() 
returns table(
    id int, "date" date, quantity int
)
language plpgsql as $$
    begin
        return query
        select inventories.id, inventories."date", inventories.quantity from inventories;
    end;
$$;

create function fn_one_inventory(_id int) 
returns table(
    "date" date,
    "description" text,
    quantity int,
    "current" boolean,
    "references" jsonb,
    prices jsonb
)
language plpgsql as $$
    begin
        return query
        select
            i."date",
            i.description,
            i.quantity,
            p."current",
            jsonb_build_object(
                'inventory',i.id,
                'product', i.prod_id,
                'supplier', i.sup_id
            ) as "references",
            jsonb_build_object(
                'purchase', p.purchase,
                'sale',p.sale
            ) as prices
        from inventories as i
        join prices as p
        on p.inv_id = i.id
        where i.id = _id;
    end;
$$;
select * from pr_list_inventory();
SELECT * from fn_one_inventory(1);

select * from inventories join prices on prices.inv_id = inventories.id where inventories.id = 1;

call pr_insert_inventory(
    '{
        "date":"2025-03-19",
        "description":"test",
        "quantity":7,
        "references":{
            "product":4,
            "supplier":1
        },
        "current":true,
        "prices":{
            "purchase":150,
            "sale":205
        }
    }'::jsonb
);

call pr_update_inventory(
    '{
        "date":"2025-04-19",
        "description":"test updated",
        "quantity":7,
        "references":{
            "product":4,
            "supplier":1,
            "inventory":8
        },
        "current":true,
        "prices":{
            "purchase":152,
            "sale":205
        }
    }'::jsonb
);

select current_date;

drop procedure pr_update_inventory;
drop procedure pr_insert_price;

select * from inventories;
select * from prices;

call pr_delete_inventory(11);
drop procedure pr_delete_inventory;

select prod_id, "current" from prices where inv_id = 9;

select * from prices where prod_id = 1 order by inv_id desc limit 1;

select count(*) from prices where prod_id = 3;

select * from products;

insert into products(name) values('test product');

select * from inventories;
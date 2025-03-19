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

create function fn_list_product()
returns table(
    id int,
    name varchar,
    description text
) language plpgsql
as $$
    begin
        return query
        select p.id, p.name, p.description
        from products as p;
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

create function pr_list_inventory() 
returns table(
    id int, "date" date, quantity int
)
language plpgsql as $$
    begin
        return query
        select inventories.id, inventories."date", inventories.quantity from inventories;
    end;
$$;

call pr_insert_inventory(
    '{
        "date":"2025-03-19",
        "description":"test",
        "quantity":7,
        "references":{
            "product":1,
            "supplier":1
        },
        "current":true,
        "prices":{
            "purchase":150,
            "sale":205
        }
    }'::jsonb
);

select current_date;

drop procedure pr_insert_inventory;
drop procedure pr_insert_price;

select * from inventories;
select * from prices;
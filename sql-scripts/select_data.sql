-- customer

select id, name, phone, address from customers;

select p.id, p.name, sum(i.quantity) as inventory, sum(s.quantity) as sold
from
    products as p
    join inventories as i on i.prod_id = p.id
    join sales as s on s.prod_id = p.id
group by
    p.id,
    p.name;

select * from inventories;

select * from sales;

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
    coalesce(i.stock, 0),
    coalesce(s.sold, 0),
    coalesce(i.stock, 0) - coalesce(s.sold, 0) as in_stock,
    (
        select sale
        from prices
        where
            prod_id = p.id
            and "current" = true
    ) * (coalesce(i.stock, 0) - coalesce(s.sold, 0)) as "value"
from
    products as p
    left join inventory as i on i.prod_id = p.id
    left join sale as s on s.prod_id = p.id
    order by p.id;

select * from prices;
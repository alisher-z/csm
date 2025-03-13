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
create procedure pr_update_customer(data jsonb) language plpgsql as $$
    begin
        update customers set
        name = nullif(trim(data->>'name'), ''),
        phone = nullif(trim(data->>'phone'),''),
        email = nullif(trim(data->>'email'),''),
        address = nullif(trim(data->>'address'),'')
        where id = (data->>'id')::integer;
    end;
$$;


create procedure pr_update_supplier(data jsonb) language plpgsql as $$
    begin
        update suppliers set
        name = nullif(trim(data->>'name'), ''),
        phone = nullif(trim(data->>'phone'),''),
        email = nullif(trim(data->>'email'),''),
        address = nullif(trim(data->>'address'),'')
        where id = (data->>'id')::integer;
    end;
$$;


create procedure pr_update_product(product jsonb) language plpgsql as $$
    begin
        update products set
        name = nullif(trim(product->>'name'), ''),
        description = nullif(trim(product->>'description'), '')
        where id = (product->>'id')::integer;
    end;
$$;

create procedure pr_update_price(price jsonb) language plpgsql as $$
    declare
        _inv_id int;
        _prod_id int;
        _purchase float;
        _sale float;
        _current boolean;

    begin
        _current := (price->>'current')::boolean;
        _inv_id := coalesce(nullif(trim(price->'references'->>'inventory'),''),'0')::integer;
        _prod_id := coalesce(nullif(trim(price->'references'->>'product'),''),'0')::integer;
        _purchase := coalesce(nullif(trim(price->'prices'->>'purchase'),''),'0')::float;
        _sale := coalesce(nullif(trim(price->'prices'->>'sale'),''),'0')::float;

        if _current = true then
            update prices set current = false where prod_id = _prod_id;
        end if;

        update prices set
            inv_id = _inv_id,
            prod_id = _prod_id,
            purchase = _purchase,
            sale = _sale,
            "current" = _current
        where inv_id = _inv_id and prod_id = _prod_id;
    end;
$$;

create procedure pr_update_inventory(inventory jsonb) language plpgsql as $$
    declare
        _id int;
        _date date;
        _description text;
        _quantity int;
        _prod_id int;
        _sup_id int;

    begin
        _date := inventory->>'date';
        _description := nullif(trim(inventory->>'description'),'');
        _quantity := coalesce(nullif(trim(inventory->>'quantity'),''),'0')::int;
        _id := coalesce(nullif(trim(inventory->'references'->>'inventory'),''),'0')::integer;
        _prod_id := coalesce(nullif(trim(inventory->'references'->>'product'),''),'0')::integer;
        _sup_id := coalesce(nullif(trim(inventory->'references'->>'supplier'),''),'0')::integer;

        update inventories set
            "date" = _date,
            description = _description,
            quantity = _quantity,
            prod_id = _prod_id,
            sup_id = _sup_id
        where id = _id;

        call pr_update_price(inventory);
    end;
$$;

select coalesce(nullif(trim('  '),''), '0')::int;
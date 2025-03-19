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
        _inv_id := (price->'references'->>'inventory')::integer;
        _prod_id := (price->'references'->>'product')::integer;
        _purchase := (price->'prices'->>'purchase')::float;
        _sale := (price->'prices'->>'sale')::float;

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
        _quantity := (inventory->>'quantity')::int;
        _id := (inventory->'references'->>'inventory')::integer;
        _prod_id := (inventory->'references'->>'product')::integer;
        _sup_id := (inventory->'references'->>'supplier')::integer;

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
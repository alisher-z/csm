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

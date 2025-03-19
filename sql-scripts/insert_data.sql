-- Active: 1741849904817@@127.0.0.1@5432@csm

create procedure pr_insert_supplier(supplier jsonb) language plpgsql as $$
    declare
        _name varchar;
        _phone varchar;
        _email varchar;
        _address varchar;

    begin
        _name := nullif(trim(supplier->>'name'),'');
        _phone := nullif(trim(supplier->>'phone'),'');
        _email := nullif(trim(supplier->>'email'),'');
        _address := nullif(trim(supplier->>'address'),'');

        insert into suppliers(name, phone, email, address)
        values(_name, _phone, _email, _address);
    end;
$$;


create procedure pr_insert_customer(customer jsonb) language plpgsql as $$
    declare
        _name varchar;
        _phone varchar;
        _email varchar;
        _address varchar;

    begin
        _name := customer->>'name';
        _phone := customer->>'phone';
        _email := customer->>'email';
        _address := customer->>'address';

        if trim(_phone) = '' then _phone := null; end if;
        if trim(_email) = '' then _email := null; end if;
        if trim(_address) = '' then _address := null; end if;

        insert into customers(name, phone, email, address)
        values(_name, _phone, _email, _address);
    end;
$$;

create procedure pr_insert_product(product jsonb) language plpgsql as $$
    declare
    _name varchar;
    _description text;

    begin
        _name := nullif(trim(product->>'name'),'');
        _description := nullif(trim(product->>'description'), '');

        insert into products(name, description)
        values(_name, _description);
    end;
$$;

create procedure pr_insert_price(price jsonb) language plpgsql as $$
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
            update prices
            set current = false
            where prod_id = _prod_id;
        end if;

        insert into prices(inv_id, prod_id, purchase, sale, current)
        values(_inv_id, _prod_id, _purchase, _sale, _current);
    end;
$$;


create procedure pr_insert_inventory(inventory jsonb) language plpgsql as $$
    declare
        inventory_id int;
        _date date;
        _description text;
        _quantity int;
        _prod_id int;
        _sup_id int;

    begin
        _date := inventory->>'date';
        _description := nullif(trim(inventory->>'description'),'');
        _quantity := coalesce(nullif(trim(inventory->>'quantity'),''),'0')::int;
        _prod_id := coalesce(nullif(trim(inventory->'references'->>'product'),''),'0')::integer;
        _sup_id := coalesce(nullif(trim(inventory->'references'->>'supplier'),''),'0')::integer;

        insert into inventories("date", "description", quantity, prod_id, sup_id)
        values (_date, _description, _quantity, _prod_id, _sup_id)
        returning id into inventory_id;


        call pr_insert_price(jsonb_set(inventory,'{references, inventory}',to_jsonb(inventory_id),true));
    end;
$$;


create procedure pr_insert_receivable(_received float, _date date, _cust_id int) language plpgsql as $$
    begin
        insert into receivables(received, "date", cust_id)
        values(_received, _date, _cust_id);
    end;
$$;


create procedure pr_insert_sale(_date date, _description text, _quantity int, _other_price float, _inv_id int, _prod_id int, _cust_id int, _received float) language plpgsql as $$
    begin
        if trim(_description) = '' then _description := null; end if;

        insert into sales("date", "description", quantity, other_price, inv_id, prod_id, cust_id)
        values(_date, _description, _quantity, _other_price, _inv_id, _prod_id, _cust_id);

        call pr_insert_receivable(_received, _date, _cust_id);
    end;
$$;


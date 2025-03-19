create procedure pr_delete_customer(_id int) language plpgsql as $$
    begin
        delete from customers where id = _id;
    end;
$$;


create procedure pr_delete_supplier(_id int) language plpgsql as $$
    begin
        delete from suppliers where id = _id;
    end;
$$;


create procedure pr_delete_product(_id int) language plpgsql as $$
    begin
        delete from products where id = _id;
    end;
$$;

create procedure pr_delete_inventory(_id int) language plpgsql as $$
    declare
        _prod_id int;
        _current boolean;

    begin
        select 
            prod_id, 
            "current" 
        into 
            _prod_id, 
            _current 
        from prices 
        where inv_id = _id;

        delete from inventories where id = _id;

        if _current = true then
            if (select count(*) from prices where prod_id = _prod_id) > 0 then
                update prices set current = true
                where inv_id = (
                    select max(inv_id) from prices where prod_id = _prod_id
                );
            end if;
        end if;
    end;
$$;
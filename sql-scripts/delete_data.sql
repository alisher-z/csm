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
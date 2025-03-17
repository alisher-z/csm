create procedure pr_delete_customer(_id int) language plpgsql
as $$
    begin
        delete from customers where id = _id;
    end;
$$;
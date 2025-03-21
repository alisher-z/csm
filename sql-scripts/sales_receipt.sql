-- Active: 1742374391022@@127.0.0.1@5432@csm
create table sales_receipts(
    id int generated always as identity primary key,
    "name" varchar(50),
    cust_id int not null references customers(id) on delete cascade
);

create procedure pr_insert_sales_receipt(receipt jsonb) language plpgsql as $$
    declare
        _id int;
        _cust_id int;

        updated_receipt jsonb;

    begin
        _cust_id := (receipt->'references'->>'customer')::int;

        insert into sales_receipts(cust_id)
        values(_cust_id)
        returning id into _id;

        updated_receipt := jsonb_set(receipt, '{references, receipt}', to_jsonb(_id), true);

        call pr_insert_sale(updated_receipt);
        call pr_insert_receivable(updated_receipt);
    end;
$$;

create procedure pr_update_sales_receipt(receipt jsonb)language plpgsql as $$
    declare
        _id int;
        _cust_id int;
        updated_receipt jsonb;

    begin
        _id := (receipt->>'id')::int;
        _cust_id := (receipt->'references'->>'customer')::int;

        update sales_receipts
        set cust_id = _cust_id
        where id = _id;

        updated_receipt := jsonb_set(receipt, '{references, receipt}', to_jsonb(_id), true);

        call pr_update_sale(updated_receipt);
        call pr_update_receivable(updated_receipt);
    end;
$$;

create procedure pr_delete_sales_receipt(_id int) language plpgsql as $$
     begin
          delete from sales_receipts where id = _id;
     end;
$$;

select 
     sr.id,
     c.name,
     jsonb_agg(
          jsonb_build_object(
               'description', s.description,
               'quantity', s.quantity,
               'prices', jsonb_build_object(
               'otherPrice', s.other_price,
               'purchase', p.purchase,
               'sale', p.sale
               ),
               'product', jsonb_build_object(
                    'id', pr.id,
                    'name', pr.name
               ),
               'inv_id', s.inv_id
          )
     ) as sales
from sales_receipts as sr
join sales as s on s.recp_id = sr.id
join customers as c on c.id = sr.cust_id
join prices as p on p.inv_id = s.inv_id and p.prod_id = s.prod_id
join products as pr on pr.id = s.prod_id
group by sr.id, c.name;

select *
from sales_receipts as sr
join sales as s on s.recp_id = sr.id
join customers as c on c.id = sr.cust_id
join prices as p on p.inv_id = s.inv_id and p.prod_id = s.prod_id
join products as pr on pr.id = s.prod_id;

call pr_insert_sales_receipt('{
     "date": "2025-03-20",
     "received": 200,
     "description": "my description",
     "references": {
          "customer": 2
     },
     "items": [
          {
               "description": "item1 description",
               "quantity": 3,
               "otherPrice": 0,
               "references": {
                    "inventory": 1,
                    "product": 1
               }
          },
          {
               "description": "item2 description",
               "quantity": 4,
               "otherPrice": 5,
               "references": {
                    "inventory": 1,
                    "product": 1
               }
          }
     ]
}');

call pr_insert_sales_receipt('{
     "date": "2025-03-21",
     "received": 0,
     "description": "my description 2",
     "references": {
          "customer": 2
     },
     "items": [
          {
               "description": "item1 description 2",
               "quantity": 5,
               "otherPrice": 0,
               "references": {
                    "inventory": 1,
                    "product": 1
               }
          },
          {
               "description": "item2 description 2",
               "quantity": 4,
               "otherPrice": 5,
               "references": {
                    "inventory": 1,
                    "product": 1
               }
          }
     ]
}');

call pr_update_sales_receipt('{
     "id": 1,
     "date": "2025-03-21",
     "received": 200,
     "description": "my description",
     "references": {
          "customer": 2
     },
     "items": [
          {
                "id":1,
               "description": "item1 description",
               "quantity": 5,
               "otherPrice": 0,
               "references": {
                    "inventory": 1,
                    "product": 1
               }
          },
          {
                "id":2,
               "description": "item2 description",
               "quantity": 7,
               "otherPrice": 5,
               "references": {
                    "inventory": 1,
                    "product": 1
               }
          }
     ]
}');

select * from sales_receipts;
select * from receivables;
select * from sales;

call pr_insert_receivable('{
     "date": "2025-03-22",
     "received": 250,
     "description": "my description1"  
}')

call pr_delete_sales_receipt(1);


call pr_insert_supplier('nothing', ' ', null, ' ');

select * from suppliers;

call pr_insert_customer('Zabiullah', '5833036082', 'a@a.com', '100 yil');
select * from customers;

call pr_insert_product('iphone 6', 'it is just testing');
call pr_insert_product('iphone 7', 'it is just testing for iphone 7');
select * from products;

call pr_insert_inventory(
    current_date,
    'we bought an iphone 6',
    5,
    1,
    1,
    1100,
    1200,
    true
);

select * from inventories;
select * from prices;

call pr_insert_inventory(
    current_date,
    'we bought an iphone 7',
    6,
    1,
    1,
    1000,
    1200,
    false
);

call pr_insert_inventory(
    current_date,
    'we bought an iphone 7',
    7,
    1,
    1,
    1000,
    1100,
    true
);

call pr_insert_inventory(
    current_date,
    'we bought an iphone 7',
    7,
    2,
    1,
    1000,
    1500,
    true
);

call pr_insert_sale(
    current_date,
    'sold iphone 6',
    2,
    0,
    1,
    1,
    1,
    1300
);

select * from sales;
select * from receivables;

select
    c.id,
    c.name,
    c.phone,
    s."date",
    p.name,
    s.quantity,
    pr.purchase,
    pr.sale,
    r."date",
    r.received
from customers as c 
join sales as s on s.cust_id = c.id
join products as p on p.id = s.prod_id
join prices as pr on pr.inv_id = s.inv_id
join receivables as r on r.cust_id = c.id;
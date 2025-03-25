-- Example: Tracking Running Balances in a Bank Account

CREATE TABLE bank_transactions (
    transaction_id SERIAL PRIMARY KEY,
    account_id INT,
    transaction_date DATE,
    amount DECIMAL(10, 2),
    transaction_type VARCHAR(10) -- 'deposit' or 'withdrawal'
);

INSERT INTO
    bank_transactions (
        account_id,
        transaction_date,
        amount,
        transaction_type
    )
VALUES (
        1,
        '2023-10-26',
        1000.00,
        'deposit'
    ),
    (
        1,
        '2023-10-27',
        -200.00,
        'withdrawal'
    ),
    (
        1,
        '2023-10-28',
        500.00,
        'deposit'
    ),
    (
        1,
        '2023-10-29',
        -100.00,
        'withdrawal'
    ),
    (
        1,
        '2023-10-30',
        250.00,
        'deposit'
    ),
    (
        2,
        '2023-10-26',
        2000.00,
        'deposit'
    ),
    (
        2,
        '2023-10-27',
        -500.00,
        'withdrawal'
    ),
    (
        2,
        '2023-10-28',
        100.00,
        'deposit'
    );

SELECT
    account_id,
    transaction_date,
    amount,
    transaction_type,
    SUM(amount) OVER (
        PARTITION BY
            account_id
        ORDER BY transaction_date
    ) AS running_balance
FROM bank_transactions
ORDER BY account_id, transaction_date;

select * from bank_transactions;

-- Example: Tracking Running Balances with Separate Deposit/Withdrawal Columns

CREATE TABLE account_transactions (
    transaction_id SERIAL PRIMARY KEY,
    account_id INT,
    transaction_date DATE,
    amount_deposited DECIMAL(10, 2),
    amount_withdrawal DECIMAL(10, 2)
);

INSERT INTO
    account_transactions (
        account_id,
        transaction_date,
        amount_deposited,
        amount_withdrawal
    )
VALUES (
        1,
        '2023-10-26',
        1000.00,
        0.00
    ),
    (1, '2023-10-27', 0.00, 200.00),
    (1, '2023-10-28', 500.00, 0.00),
    (1, '2023-10-29', 0.00, 100.00),
    (1, '2023-10-30', 250.00, 0.00),
    (
        2,
        '2023-10-26',
        2000.00,
        0.00
    ),
    (2, '2023-10-27', 0.00, 500.00),
    (2, '2023-10-28', 100.00, 0.00);

SELECT
    account_id,
    transaction_date,
    amount_deposited,
    amount_withdrawal,
    SUM(
        amount_deposited - amount_withdrawal
    ) OVER (
        PARTITION BY
            account_id
        ORDER BY transaction_date
    ) AS running_balance
FROM account_transactions
ORDER BY account_id, transaction_date;

select * from account_transactions;

update account_transactions
set
    amount_withdrawal = 350
where
    transaction_id = 3;

SELECT
    account_id,
    transaction_date,
    amount_deposited,
    amount_withdrawal,
    case
        when amount_deposited < 1 then 0
        else amount_deposited - amount_withdrawal
    end as blance,
    SUM(
        amount_deposited - amount_withdrawal
    ) OVER (
        PARTITION BY
            account_id
        ORDER BY transaction_date
    ) AS running_balance
FROM account_transactions
ORDER BY account_id, transaction_date;

SELECT
    account_id,
    transaction_date,
    amount_deposited,
    amount_withdrawal,
    case
        when amount_deposited < 1 then 0
        else amount_deposited - amount_withdrawal
    end as blance,
    SUM(
        amount_deposited - amount_withdrawal
    ) OVER (
        ORDER BY transaction_id
    ) AS running_balance
FROM account_transactions
ORDER BY account_id, transaction_date;

drop table tbl_parent;

create table tbl_parent (
    id SERIAL primary key,
    received int default 0
);

drop table tbl_child;

create table tbl_child (
    id serial primary key,
    p_id int references tbl_parent (id),
    r_id int,
    amount int
)

insert into tbl_parent (received) values (100);

insert into tbl_parent (received) values (200);

insert into tbl_parent (received) values (150);

insert into tbl_parent (received) values (50);

select * from tbl_parent;

insert into tbl_child (p_id, r_id, amount) values (1, 1, 600);

insert into tbl_child (p_id, r_id, amount) values (2, 1, 00);

insert into tbl_child (p_id, r_id, amount) values (3, 1, 00);

insert into tbl_child (p_id, r_id, amount) values (4, 1, 00);

select * from tbl_child;

select p.id, p.received, c.r_id, c.amount
from tbl_parent p
    join tbl_child c on c.p_id = p.id;

drop table cash_book;

CREATE TABLE cash_book (
    id SERIAL PRIMARY KEY,
    account_name VARCHAR(50),
    transaction_type VARCHAR(20),
    debit NUMERIC,
    credit NUMERIC,
    transaction_date DATE
);

INSERT INTO
    cash_book (
        account_name,
        transaction_type,
        debit,
        credit,
        transaction_date
    )
VALUES (
        'Cash',
        'income',
        0,
        1000,
        '2025-03-20'
    ),
    (
        'Cash',
        'income',
        0,
        500,
        '2025-03-21'
    ),
    (
        'Cash',
        'expense',
        200,
        0,
        '2025-03-22'
    ),
    (
        'Bank',
        'income',
        0,
        2000,
        '2025-03-20'
    ),
    (
        'Bank',
        'expense',
        300,
        0,
        '2025-03-21'
    ),
    (
        'Bank',
        'expense',
        100,
        0,
        '2025-03-22'
    );

SELECT
    account_name,
    transaction_type,
    debit,
    credit,
    -- SUM(debit) AS total_debit,
    -- SUM(credit) AS total_credit,
    -- SUM(credit - debit) OVER (PARTITION BY account_name) AS balance_by_account,
    -- SUM(credit - debit) OVER (PARTITION BY transaction_type) AS balance_by_account
    -- SUM(credit - debit) OVER (PARTITION BY account_name, transaction_type) AS balance_by_type
    SUM(credit - debit) OVER (
        PARTITION BY
            transaction_type,
            account_name
    ) AS balance_by_type
FROM cash_book;
-- GROUP BY
--     account_name, transaction_type;

select * from cash_book;

select * from sales_receipts;

select * from sales;

select * from reconciliations;

select * from receivables;

call pr_insert_sales_receipt (
    '{
    "references": {
        "customer": 1
    },
    "date": "2025-03-22",
    "name": "Sales Receipt #001",
    "description": "Sales for March",
    "gift": "0",
    "received": "1000",
    "items": [
        {
            "description": "Product A",
            "quantity": "2",
            "price": "100",
            "references": {
                "product": 1
            }
        },
        {
            "description": "Product B",
            "quantity": "3",
            "price": "150",
            "references": {
                "product": 1
            }
        }
    ]
}'
);

select sr.id, c.name, jsonb_agg(
        jsonb_build_object(
            'id', s.id, 
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
from
    sales_receipts as sr
    join sales as s on s.recp_id = sr.id
    join customers as c on c.id = sr.cust_id
    join prices as p on p.inv_id = s.inv_id
    and p.prod_id = s.prod_id
    join products as pr on pr.id = s.prod_id
group by
    sr.id,
    c.name;

with _inventories as (
    select prod_id, sum(quantity) as quantity from inventories group by prod_id
)
select p.id, p.name, p.description, i.quantity, pr.purchase, pr.sale
from products as p
join _inventories as i on i.prod_id = p.id
join prices as pr on pr.prod_id = p.id
where pr.current = true
order by id;
select * from inventories;
select * from prices;

update prices set current = TRUE where prod_id = 2;
update prices set
purchase = 4,
sale = 5
where prod_id = 1 and current = true;

select * from fn_list_product();

with _inventories as (
                select _i.prod_id, sum(_i.quantity) as quantity from inventories as _i group by _i.prod_id
                )
            select 
                p.id, 
                p.name, 
                p.description, 
                i.quantity, 
                pr.purchase, 
                pr.sale
            from products as p
            join _inventories as i on i.prod_id = p.id
            join prices as pr on pr.prod_id = p.id
            where pr.current = true
            order by id;
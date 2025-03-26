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


select * from sales_receipts;
select * from sales;
select * from reconciliations;
select * from receivables;

select sr.id, sr.date, c.id, c.name, sr.description, sr.gift, r.amount
from sales_receipts as sr
join customers as c on c.id = sr.cust_id
join receivables as r on r.recp_id = sr.id;

select
    s.id, 
    p.id,
    p.name,
    s.description,
    s.quantity,
    s.price
from sales as s
join products as p on p.id = s.prod_id;

select
    sr.id,
    sr.date,
    sr.description,
    jsonb_build_object(
        'id',c.id,
        'name',c.name
    ) as customer,
    jsonb_build_object(
        'gift',sr.gift,
        'received',r.amount
    ) as amounts,
    jsonb_agg(
        jsonb_build_object(
            'id',s.id,
            'description',s.description,
            'quantity', s.quantity,
            'price', s.price,
            'product', jsonb_build_object(
                'id',p.id,
                'name',p.name
            )
        )
    ) as sales
from sales_receipts as sr
join customers as c on c.id = sr.cust_id
join receivables as r on r.recn_id = sr.id
join sales as s on s.recp_id = sr.id
join products as p on p.id = s.prod_id
where sr.id = 2
group by sr.id, sr.date, sr.description, c.id, c.name, sr.gift, r.amount;

select * from fn_one_sales_receipt(2);

select * from customers;

delete from customers where id > 1;

insert into customers(name, phone, email, address)
values
('Ahmet Yilmaz','532 123 45 67','ahmet.yilmaz@example.com','Kocatepe Mah. 123 Sk. No: 5, Cankaya, Ankara'),
('Ayse Kaya','533 234 56 78','ayse.kaya@example.com','Ataturk Bulv. No: 12, Kadikoy, Istanbul'),
('Mehmet Demir','534 345 67 89','mehmet.demir@example.com','Bahcelievler 7. Cad. No: 3, Bahcelievler, Istanbul'),
('Fatma Celik','535 456 78 90','fatma.celik@example.com','Inonu Mah. 456 Sk. No: 8, Bornova, Izmir'),
('Ali Ozturk','536 567 89 01','ali.ozturk@example.com','Cumhuriyet Cad. No: 15, Cankaya, Ankara'),
('Zeynep Aydin','537 678 90 12','zeynep.aydin@example.com','Fevzi Cakmak Mah. 789 Sk. No: 2, Uskudar, Istanbul'),
('Mustafa Sahin','538 789 01 23','mustafa.sahin@example.com','Gazi Bulv. No: 10, Konak, Izmir'),
('Emine Arslan','539 890 12 34','emine.arslan@example.com','Mithatpasa Cad. No: 25, Beyoglu, Istanbul'),
('Hakan Korkmaz','540 901 23 45','hakan.korkmaz@example.com','Barbaros Mah. 101 Sk. No: 7, Atasehir, Istanbul'),
('Elif Aksoy','541 012 34 56','elif.aksoy@example.com','Yesilkoy Mah. 234 Sk. No: 4, Bakirkoy, Istanbul'),
('Burak Erdogan','542 123 45 67','burak.erdogan@example.com','Kizilay Mah. 567 Sk. No: 9, Cankaya, Ankara'),
('Selin Gunes','543 234 56 78','selin.gunes@example.com','Alsancak 1453 Sk. No: 6, Konak, Izmir'),
('Okan Cetin','544 345 67 89','okan.cetin@example.com','Etiler Mah. 890 Sk. No: 11, Besiktas, Istanbul'),
('Derya Polat','545 456 78 90','derya.polat@example.com','Sihhiye 321 Sk. No: 3, Cankaya, Ankara'),
('Kadir Toprak','546 567 89 01','kadir.toprak@example.com','Kucukbakkalkoy Mah. 654 Sk. No: 5, Atasehir, Istanbul'),
('Esra Karaca','547 678 90 12','esra.karaca@example.com','Narlidere 987 Sk. No: 2, Narlidere, Izmir'),
('Ismail Bulut','548 789 01 23','ismail.bulut@example.com','Bagdat Cad. No: 18, Kadikoy, Istanbul'),
('Gulay Simsek','549 890 12 34','gulay.simsek@example.com','Tunali Hilmi Cad. No: 22, Cankaya, Ankara'),
('Cem Kaplan','550 901 23 45','cem.kaplan@example.com','Bostanci Mah. 111 Sk. No: 13, Kadikoy, Istanbul'),
('Aslihan Tekin','551 012 34 56','aslihan.tekin@example.com','Karsiyaka 222 Sk. No: 7, Karsiyaka, Izmir'),
('Eren Dogan','552 123 45 67','eren.dogan@example.com','Maslak 333 Sk. No: 9, Sariyer, Istanbul'),
('Buse Yildiz','553 234 56 78','buse.yildiz@example.com','Cankaya Mah. 444 Sk. No: 1, Cankaya, Ankara'),
('Onur Ates','554 345 67 89','onur.ates@example.com','Moda Cad. No: 30, Kadikoy, Istanbul'),
('Seda Ucar','555 456 78 90','seda.ucar@example.com','Goztepe Mah. 555 Sk. No: 4, Goztepe, Izmir'),
('Tolga Bayram','556 567 89 01','tolga.bayram@example.com','Levent 666 Sk. No: 6, Besiktas, Istanbul'),
('Merve Koc','557 678 90 12','merve.koc@example.com','Kavaklidere Mah. 777 Sk. No: 8, Cankaya, Ankara'),
('Baris Sen','558 789 01 23','baris.sen@example.com','Suadiye Mah. 888 Sk. No: 10, Kadikoy, Istanbul'),
('Pinar Gunduz','559 890 12 34','pinar.gunduz@example.com','Alsancak 999 Sk. No: 12, Konak, Izmir'),
('Yasin Tas','560 901 23 45','yasin.tas@example.com','Acibadem Mah. 1010 Sk. No: 14, Uskudar, Istanbul'),
('Deniz Kurt','561 012 34 56','deniz.kurt@example.com','Kordonboyu 1111 Sk. No: 16, Alsancak, Izmir'),
('Caner Ozkan','562 123 45 67','caner.ozkan@example.com','Nisantasi 1212 Sk. No: 18, Sisli, Istanbul'),
('Tugba Soyadi','563 234 56 78','tugba.soyadi@example.com','Umit Mah. 1313 Sk. No: 20, Cankaya, Ankara'),
('Firat Akin','564 345 67 89','firat.akin@example.com','Fenerbahce Mah. 1414 Sk. No: 22, Kadikoy, Istanbul'),
('Ceren Unal','565 456 78 90','ceren.unal@example.com','Bornova 1515 Sk. No: 24, Bornova, Izmir'),
('Koray Mert','566 567 89 01','koray.mert@example.com','Beylikduzu 1616 Sk. No: 26, Beylikduzu, Istanbul'),
('Ece Durmaz','567 678 90 12','ece.durmaz@example.com','Kizilay 1717 Sk. No: 28, Cankaya, Ankara'),
('Arda Kilic','568 789 01 23','arda.kilic@example.com','Erenkoy Mah. 1818 Sk. No: 30, Kadikoy, Istanbul'),
('Melis Coban','569 890 12 34','melis.coban@example.com','Guzelyali 1919 Sk. No: 32, Konak, Izmir'),
('Yigit Sener','570 901 23 45','yigit.sener@example.com','Zekeriyakoy 2020 Sk. No: 34, Sariyer, Istanbul'),
('Hande Tuncer','571 012 34 56','hande.tuncer@example.com','Sogutozu Mah. 2121 Sk. No: 36, Cankaya, Ankara'),
('Umut Ciftci','572 123 45 67','umut.ciftci@example.com','Cengelkoy 2222 Sk. No: 38, Uskudar, Istanbul'),
('Berna Aktas','573 234 56 78','berna.aktas@example.com','Mavisehir 2323 Sk. No: 40, Karsiyaka, Izmir'),
('Kaan Guler','574 345 67 89','kaan.guler@example.com','Ortakoy Mah. 2424 Sk. No: 42, Besiktas, Istanbul'),
('Lale Ozdemir','575 456 78 90','lale.ozdemir@example.com','Dikmen 2525 Sk. No: 44, Cankaya, Ankara'),
('Emre Bas','576 567 89 01','emre.bas@example.com','Sahrayicedit Mah. 2626 Sk. No: 46, Kadikoy, Istanbul'),
('Sibel Kara','577 678 90 12','sibel.kara@example.com','Bostanli 2727 Sk. No: 48, Karsiyaka, Izmir'),
('Oguzhan Yavuz','578 789 01 23','oguzhan.yavuz@example.com','Yesilyurt 2828 Sk. No: 50, Konak, Izmir'),
('Tuba Erdem','579 890 12 34','tuba.erdem@example.com','Cayyolu 2929 Sk. No: 52, Cankaya, Ankara'),
('Volkan Sonmez','580 901 23 45','volkan.sonmez@example.com','Kalamis Mah. 3030 Sk. No: 54, Kadikoy, Istanbul'),
('Naber Ozer','581 012 34 56','naber.ozer@example.com','Balova 3131 Sk. No: 56, Balova, Izmir');
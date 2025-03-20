
-- Example: Tracking Running Balances in a Bank Account

CREATE TABLE bank_transactions (
    transaction_id SERIAL PRIMARY KEY,
    account_id INT,
    transaction_date DATE,
    amount DECIMAL(10, 2),
    transaction_type VARCHAR(10) -- 'deposit' or 'withdrawal'
);

INSERT INTO bank_transactions (account_id, transaction_date, amount, transaction_type) VALUES
(1, '2023-10-26', 1000.00, 'deposit'),
(1, '2023-10-27', -200.00, 'withdrawal'),
(1, '2023-10-28', 500.00, 'deposit'),
(1, '2023-10-29', -100.00, 'withdrawal'),
(1, '2023-10-30', 250.00, 'deposit'),
(2, '2023-10-26', 2000.00, 'deposit'),
(2, '2023-10-27', -500.00, 'withdrawal'),
(2, '2023-10-28', 100.00, 'deposit');

SELECT
    account_id,
    transaction_date,
    amount,
    transaction_type,
    SUM(amount) OVER (PARTITION BY account_id ORDER BY transaction_date) AS running_balance
FROM
    bank_transactions
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
INSERT INTO account_transactions (account_id, transaction_date, amount_deposited, amount_withdrawal) VALUES
(1, '2023-10-26', 1000.00, 0.00),
(1, '2023-10-27', 0.00, 200.00),
(1, '2023-10-28', 500.00, 0.00),
(1, '2023-10-29', 0.00, 100.00),
(1, '2023-10-30', 250.00, 0.00),
(2, '2023-10-26', 2000.00, 0.00),
(2, '2023-10-27', 0.00, 500.00),
(2, '2023-10-28', 100.00, 0.00);

SELECT
    account_id,
    transaction_date,
    amount_deposited,
    amount_withdrawal,
    SUM(amount_deposited - amount_withdrawal) OVER (PARTITION BY account_id ORDER BY transaction_date) AS running_balance
FROM
    account_transactions
ORDER BY account_id, transaction_date;


select * from account_transactions;

update account_transactions set
amount_withdrawal = 350
where transaction_id = 3;

SELECT
    account_id,
    transaction_date,
    amount_deposited,
    amount_withdrawal,
    case
        when amount_deposited < 1 then 0
        else  amount_deposited - amount_withdrawal
    end as blance,
    SUM(amount_deposited - amount_withdrawal) OVER (PARTITION BY account_id ORDER BY transaction_date) AS running_balance
FROM
    account_transactions
ORDER BY account_id, transaction_date;


SELECT
    account_id,
    transaction_date,
    amount_deposited,
    amount_withdrawal,
    case
        when amount_deposited < 1 then 0
        else  amount_deposited - amount_withdrawal
    end as blance,
    SUM(amount_deposited - amount_withdrawal) OVER (ORDER BY transaction_id) AS running_balance
FROM
    account_transactions
ORDER BY account_id, transaction_date;
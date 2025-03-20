import express from 'express';
import cors from 'cors';
import pool from './db';
import customerRouter from './routes/customer-route';
import supplierRouter from './routes/supplier.route';
import productRouter from './routes/product.route';
import inventoryRouter from './routes/inventory.route';
import { run } from './test';
run();
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/customer', customerRouter);
app.use('/supplier', supplierRouter);
app.use('/product', productRouter);
app.use('/inventory', inventoryRouter);

app.get('/', async (req, res) => {
    const data = await pool.query('select * from fn_get_products()');
    res.send(data.rows)
});

app.listen(PORT, () => console.log('server is running!'))
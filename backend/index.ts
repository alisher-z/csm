import express from 'express';
import pool from './db';
import customerRouter from './routes/customer-route';

const app = express();
const PORT = 3000;

app.use('/customer', customerRouter);
app.get('/', async (req, res) => {
    const data = await pool.query('select * from fn_get_products()');
    res.send(data.rows)
})
app.listen(PORT, () => console.log('server is running!'))
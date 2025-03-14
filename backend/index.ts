import express from 'express';
import pool from './db';

const app = express();
const PORT = 3000;

app.get('/', async (req, res) => {
    const data = await pool.query('select * from fn_get_products()');
    res.send(data.rows)
})
app.listen(PORT, () => console.log('server is running!'))
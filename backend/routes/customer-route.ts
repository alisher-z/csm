import { Router } from "express";
import { get, insert } from '../orm/customer-orm';

const router = Router();

router
    .get('/', async (req, res) => {
        const result = await get();
        res.send(result);
    })
    .post('/', async (req, res) => {
        const result = await insert(req.body);
        res.send(result);
    });


export default router;
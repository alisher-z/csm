import { Router } from "express";
import { get, insert } from '../orm/customer-orm';

const router = Router();

router
    .get('/', async (req, res) => {
        // console.log(req.params);
        // console.log('requested');
        const result = await get();
        res.send(result);
    })
    .get('/:id', (req, res) => {
        console.log(+req.params.id);
        res.send({ success: 'very good' });
    })
    .post('/', async (req, res) => {
        const result = await insert(req.body);
        res.send(result);
    });


export default router;
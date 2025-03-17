import { Router } from "express";
import { Customer } from '../orm/customer-orm';
import mainRoute from './main-route';

const router = Router();

router
    .use((req, _, next) => {
        (<any>req).model = new Customer();
        next();
    })
    .use(mainRoute);
// .get('/', async (req, res) => {
//     // console.log(req.params);
//     // console.log('requested');
//     const result = await get();
//     res.send(result);
// })
// .get('/:id', (req, res) => {
//     console.log(+req.params.id);
//     res.send({ success: 'very good' });
// })
// .post('/', async (req, res) => {
//     const result = await insert(req.body);
//     res.send(result);
// });


export default router;
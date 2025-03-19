import { Router } from 'express';
import { Inventory } from '../orm/inventory.orm';
import mainRoute from './main.route';

const router = Router();

router
    .use((req, _, next) => {
        (<any>req)['model'] = new Inventory();
        next();
    })
    .use(mainRoute);

export default router;
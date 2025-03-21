import { Router } from 'express';
import mainRoute from './main.route';
import { SalesReceipt } from '../orm/sales-receipt.orm';

const router = Router();

router
    .use((req, _, next) => {
        (<any>req)['model'] = new SalesReceipt();
        next();
    })
    .use(mainRoute);

export default router;
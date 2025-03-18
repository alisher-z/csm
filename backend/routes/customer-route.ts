import { Router } from "express";
import { Customer } from '../orm/customer-orm';
import mainRoute from './main.route';

const router = Router();

router
    .use((req, _, next) => {
        (<any>req).model = new Customer();
        next();
    })
    .use(mainRoute);

export default router;
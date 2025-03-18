import { Router } from "express";
import { Supplier } from "../orm/supplier.orm";
import mainRoute from './main-route';

const router = Router();

router
    .use((req, _, next) => {
        (<any>req)['model'] = new Supplier();
        next();
    })
    .use(mainRoute);

export default router;
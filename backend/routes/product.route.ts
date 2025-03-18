import { Router } from "express";
import { Product } from '../orm/product.orm'
import mainRoute from './main.route';

const router = Router();

router
    .use((req, _, next) => {
        (<any>req)['model'] = new Product();
        next();
    })
    .use(mainRoute);

export default router;
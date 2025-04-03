import { Router } from 'express';
import mainRoute from './main.route';
import { Reconciliation } from '../orm/reconciliation.orm';

const router = Router();
router
    .use((req, _, next) => {
        (<any>req)['model'] = new Reconciliation();
        next();
    })
    .get('/uncleared', async (req, res) => {
        const model = (<any>req).model as Reconciliation;
        const { status, error, success } = await model.uncleared(req.query);

        res.status(status)
        res.send(error ?? success);
    })
    .use(mainRoute);

export default router;
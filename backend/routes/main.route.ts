import { NextFunction, Request, Response, Router } from "express";
import { DBResult, MainORM } from "../orm/main.orm";

let model: MainORM;
const router = Router();

router
    .use((req, _, next) => {
        model = (<any>req)['model'];
        next();
    })

    .get('/:id', firstInit, (req, res, next): any => {
        (<any>req)['result'] = model.one(+req.params.id);

        next();
    })

    .get('/', (req, res, next) => {
        (<any>req)['result'] = model.list();
        next()
    })

    .post('/', (req, _, next) => {
        (<any>req)['result'] = model.insert(req.body);
        next();
    })

    .put('/:id', (req, _, next) => {
        (<any>req)['result'] = model.update({
            ...req.body,
            id: +req.params.id
        });
        next();
    })

    .delete('/:id', (req, _, next) => {
        (<any>req)['result'] = model.delete(+req.params.id);
        next();
    })

    .use(async (req, res) => {
        const { status, error, success }: DBResult = await (<any>req).result;
        console.log(success);

        res.status(status);
        res.send(error ?? success);
    });

export default router;

function firstInit(req: Request, res: Response, next: NextFunction): any {
    +req.params.id < 1
        ? res.send({ success: 'success' })
        : next();
}
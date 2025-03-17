import { NextFunction, Request, Response, Router } from "express";
import { DBResult, MainORM } from "../orm/main.orm";

let model: MainORM;
const router = Router();

router
    .use((req, _, next) => {
        model = (<any>req)['model'];
        next();
    })

    .get('/:id', firstInit, (req, res): any => {

    })

    .get('/', (req, res, next) => {
        (<any>req)['result'] = model.list();
        next()
    })

    .use(async (req, res) => {
        const { status, error, success }: DBResult = await (<any>req).result;

        res.status(status);
        console.log(await success);
        res.send(error ?? await success);
    });

export default router;

function firstInit(req: Request, res: Response, next: NextFunction): any {
    const id: number = req.params ? +req.params.id : -1;

    if (isNaN(id))
        return res.status(400).send({ error: 'bad request' });

    if (id < 1)
        return res.send({ success: 'success' });

    next();
}
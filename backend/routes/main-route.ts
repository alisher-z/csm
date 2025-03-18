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
        console.log(req.query)
        next()
    })

    .post('/', firstInit, (req, _, next) => {
        (<any>req)['result'] = model.insert(req.body);
        next();
    })

    .delete('/:id', firstInit, (req, _, next) => {
        (<any>req)['result'] = model.delete(+req.params.id);
        next();
    })

    .use(async (req, res) => {
        const { status, error, success }: DBResult = await (<any>req).result;

        res.status(status);
        res.send(error ?? success);
    });

export default router;

function firstInit(req: Request, res: Response, next: NextFunction): any {
    const data = getInitData(req);

    if (data < 1)
        return res.send({ message: 'success' });

    next();
}

function getInitData({ method, params, body }: Request) {
    if (method === 'POST')
        return +body.init;

    return +params.id;
}
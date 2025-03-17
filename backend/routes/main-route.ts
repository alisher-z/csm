import { NextFunction, Request, Response, Router } from "express";
import { MainORM } from "../orm/main.orm";

const router = Router();

router
    .get('/:id', (req, res): any => {
        let id: number = -1;
        if (req.params)
            id = +req.params.id;

        if (isNaN(id))
            return res
                .status(400)
                .send({ error: 'bad request' });

        if (id < 1)
            return res.send({ initial: 'success' });

        return res.send({ hello: 'world' })
    })

    .get('/', async (req, res): Promise<any> => {
        const model: MainORM = (<any>req).model;
        const { status, error, success } = await model.list()

        res.status(status);

        if (error)
            return res.send(error);

        res.send(success);
    })
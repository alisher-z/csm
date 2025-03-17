import { Router } from "express";

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
    .get('/', (req, res): any => {

    })
import db from '../db';
import { DBResultType, DBMessageType } from '../types/db-types';

export abstract class MainORM {
    protected abstract insert: string;

    list() {

    }
}


function getResult(data: any, isSuccess: boolean): DBResultType {
    if (isSuccess)
        return { success: getSuccess(data) }

    return { error: getError(data) };
}

function getSuccess(data: any): DBMessageType {
    return {
        message: data,
        status: 200
    }
}
function getError(err: any): DBMessageType {
    console.log(err);
    return {
        message: 'something is wrong with db',
        status: 404
    }
}
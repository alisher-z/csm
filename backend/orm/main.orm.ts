import db from '../db';
import { DBResultType, DBMessageType } from '../types/db-types';

export abstract class DBQuery {
    protected abstract model: string;

    protected get insertString() {
        return `call pr_insert_${this.model}`;
    }
    protected get updateString() {
        return `call pr_update_${this.model}`;
    }
    protected get selectString() {
        return `select * from fn_list_${this.model}`;
    }

    protected async getProcedureQuery(fn: string, params: any) {
        await db.query(`${fn}('${params}')`);
        return { message: 'success!' };
    }
    protected async getFunctionQuery(fn: string, params?: any) {
        const qrySt = params
            ? `${this.selectString}('${params}')`
            : `${this.selectString}()`;

        const result = await db.query(qrySt);
        return result.rows;
    }

    protected async attempt(result: any) {
        try {
            return getResult(result, true);
        } catch (error) {
            return getResult(error, false);
        }
    }
}

export abstract class MainORM extends DBQuery {

    async list() {
        const result = this.getFunctionQuery(this.selectString);
        return await (this.attempt(result));
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
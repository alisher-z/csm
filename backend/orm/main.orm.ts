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
        return 'success!';
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
            return new DBResult(result);
        } catch (error) {
            return new DBResult(error, true);
        }
    }
}

export abstract class MainORM extends DBQuery {

    async list(): Promise<DBResult> {
        const result = this.getFunctionQuery(this.selectString);
        return await (this.attempt(result));
    }
}

export class DBResult {
    constructor(private _data: any, private _error = false) { }

    get success(): any | null {
        return this._error
            ? null
            : this._data;
    }

    get error() {
        if (!this._error)
            return null;

        console.log(this._data);
        return 'something went wrong with db!';
    }

    get status() {
        return this._error ? 400 : 200;
    }
}
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
    protected get listString() {
        return `select * from fn_list_${this.model}`;
    }
    protected get oneString() {
        return `select * from fn_one_${this.model}`;
    }

    protected async getProcedureQuery(fn: string, params: any) {
        await db.query(`${fn}('${JSON.stringify(params)}')`);
        return { message: 'success' };
    }

    protected async getFunctionQuery(fn: string, params?: any) {
        const qrySt = params
            ? `${fn}('${params}')`
            : `${fn}()`;

        const { rows } = await db.query(qrySt);

        if (rows.length === 1)
            return rows[0]

        return rows;
    }

    protected async attempt(result: Promise<any>) {
        try {
            return new DBResult(await result);
        } catch (error) {
            return new DBResult(error, true);
        }
    }
}

export abstract class MainORM extends DBQuery {

    async list(): Promise<DBResult> {
        const result = this.getFunctionQuery(this.listString);
        return await (this.attempt(result));
    }

    async one(id: number): Promise<DBResult> {
        const result = this.getFunctionQuery(this.oneString, id);
        return await (this.attempt(result));
    }
    async insert(data: any) {
        const result = this.getProcedureQuery(this.insertString, data);
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
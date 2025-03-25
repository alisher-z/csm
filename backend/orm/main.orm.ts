import db from '../db';

export abstract class DBQuery {
    protected abstract model: string;

    protected get insertString() {
        return `call pr_insert_${this.model}`;
    }
    protected get updateString() {
        return `call pr_update_${this.model}`;
    }
    protected get deleteString() {
        return `call pr_delete_${this.model}`
    }
    protected get listString() {
        return `select * from fn_list_${this.model}`;
    }
    protected get oneString() {
        return `select * from fn_one_${this.model}`;
    }

    protected async getProcedureQuery(fn: string, params: any) {
        await db.query(`${fn}('${params}')`);
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
        if (this.model === 'product')
            console.log(await result)
        return await (this.attempt(result));
    }

    async one(id: number): Promise<DBResult> {
        const result = this.getFunctionQuery(this.oneString, id);
        return await (this.attempt(result));
    }
    async insert(data: any) {
        data = JSON.stringify(data);
        console.log(data);
        const result = this.getProcedureQuery(this.insertString, data);
        return await (this.attempt(result));
    }
    async update(data: any) {
        data = JSON.stringify(data);
        const result = this.getProcedureQuery(this.updateString, data);
        return (this.attempt(result));
    }
    async delete(id: number) {
        const result = this.getProcedureQuery(this.deleteString, id);
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
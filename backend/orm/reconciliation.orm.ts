import { DBResult, MainORM } from "./main.orm";

export class Reconciliation extends MainORM {
    protected model = 'reconciliation';

    async uncleared(search: any): Promise<DBResult> {
        const _serach = JSON.stringify(search);
        const result = this.getFunctionQuery('select * from fn_list_uncleared_reconciliation', _serach);
        return await (this.attempt(result));
    }
}